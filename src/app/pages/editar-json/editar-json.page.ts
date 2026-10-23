import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';
import { EditorSelection } from '@codemirror/state';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { HighlightStyle, ensureSyntaxTree, syntaxHighlighting } from '@codemirror/language';
import { linter, lintGutter } from '@codemirror/lint';
import { tags } from '@lezer/highlight';
import { GameService } from 'src/app/services/game/game.service';
import { ComponentCanDeactivate } from 'src/app/guards/can-deactivate.guard';

interface ErrorJson {
  mensaje: string;
  pos: number | null;
  linea: number | null;
  columna: number | null;
  textoLinea: string | null;
}

// Editor del JSON crudo de un partido (el mismo que copia "Copiar"), con
// resaltado, números de línea y marcado de errores al estilo de VS Code
// (CodeMirror 6). Solo se guarda al apretar "Guardar" y si el JSON es válido.
@Component({
  selector: 'app-editar-json',
  templateUrl: './editar-json.page.html',
  styleUrls: ['./editar-json.page.scss'],
  standalone: false,
})
export class EditarJsonPage implements ComponentCanDeactivate {

  @ViewChild('contenedor', { static: false }) contenedor?: ElementRef<HTMLDivElement>;

  partido: any = null;
  error: ErrorJson | null = null;

  private editor: EditorView | null = null;
  private textoGuardado = '';

  // Mismos colores que VS Code (Light+/Dark+), definidos como variables CSS
  // en editar-json.page.scss para que cambien con el modo oscuro.
  private readonly resaltado = HighlightStyle.define([
    { tag: tags.propertyName, color: 'var(--json-clave)' },
    { tag: tags.string, color: 'var(--json-texto)' },
    { tag: tags.number, color: 'var(--json-numero)' },
    { tag: [tags.bool, tags.null], color: 'var(--json-literal)' },
    { tag: [tags.separator, tags.brace, tags.squareBracket, tags.punctuation], color: 'var(--json-puntuacion)' },
  ]);

  private readonly tema = EditorView.theme({
    '&': { height: '100%', fontSize: '13px', backgroundColor: 'var(--json-fondo)', color: 'var(--json-puntuacion)' },
    '.cm-scroller': { fontFamily: "Menlo, Consolas, 'Courier New', monospace", lineHeight: '1.5' },
    '.cm-gutters': { backgroundColor: 'var(--json-gutter)', color: 'var(--json-numero-linea)', border: 'none' },
    '.cm-activeLine': { backgroundColor: 'var(--json-linea-activa)' },
    '.cm-activeLineGutter': { backgroundColor: 'var(--json-linea-activa)' },
    '.cm-content': { caretColor: 'var(--ion-color-primary)' },
    '&.cm-focused .cm-cursor': { borderLeftColor: 'var(--ion-color-primary)' },
    '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground': { backgroundColor: 'var(--json-seleccion)' },
  });

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertController: AlertController,
    private toastController: ToastController,
    private _game_: GameService
  ) { }

  ionViewDidEnter() {
    const id = this.route.snapshot.queryParamMap.get('id');
    this.partido = this._game_.partidos.find((p: any) => p.id === id) || null;
    if (!this.partido || !this.contenedor) {
      this.navCtrl.back();
      return;
    }

    this.textoGuardado = JSON.stringify(this.partido, null, 2);
    this.error = null;
    this.editor?.destroy();
    this.editor = new EditorView({
      doc: this.textoGuardado,
      parent: this.contenedor.nativeElement,
      // Dentro de ion-content, CodeMirror detecta como raíz un
      // DocumentFragment y monta ahí sus estilos, que nunca se aplican:
      // se le indica el documento explícitamente.
      root: document,
      extensions: [
        basicSetup,
        json(),
        linter(jsonParseLinter()),
        lintGutter(),
        syntaxHighlighting(this.resaltado),
        this.tema,
        EditorView.lineWrapping,
        // El aviso de error se limpia apenas se vuelve a escribir: se
        // revalida recién al apretar "Guardar".
        EditorView.updateListener.of(update => {
          if (update.docChanged && this.error) this.error = null;
        }),
      ],
    });
  }

  ionViewWillLeave() {
    this.editor?.destroy();
    this.editor = null;
  }

  private get texto(): string {
    return this.editor?.state.doc.toString() ?? this.textoGuardado;
  }

  async guardar() {
    if (!this.partido || !this.editor) return;

    let datos: any;
    try {
      datos = JSON.parse(this.texto);
    } catch (e: any) {
      this.error = this.ubicarError(e);
      this.irAlError();
      return;
    }

    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
      this.error = { mensaje: 'El partido debe ser un objeto ({ ... }).', pos: null, linea: null, columna: null, textoLinea: null };
      return;
    }
    // El id es la clave con que se guarda el partido: cambiarlo crearía
    // un partido nuevo y dejaría el original duplicado.
    if (datos.id !== this.partido.id) {
      this.error = { mensaje: `El campo "id" no se puede cambiar (debe ser "${this.partido.id}").`, pos: null, linea: null, columna: null, textoLinea: null };
      return;
    }

    this.error = null;
    await this._game_.reemplazarPartido(this.partido, datos);
    this.textoGuardado = this.texto;

    const toast = await this.toastController.create({
      message: 'JSON guardado',
      duration: 1500,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }

  // Lleva el cursor a la posición del error y la deja a la vista.
  irAlError() {
    if (!this.editor || this.error?.pos === null || this.error?.pos === undefined) return;
    const pos = Math.min(this.error.pos, this.editor.state.doc.length);
    this.editor.dispatch({
      selection: EditorSelection.cursor(pos),
      effects: EditorView.scrollIntoView(pos, { y: 'center' })
    });
    this.editor.focus();
  }

  // Ubica el error de JSON.parse. Chrome/Android informa "at position N"
  // (y a veces "line X column Y"), Firefox "line X column Y"; Safari/iOS no
  // da posición, así que en ese caso se busca el primer nodo con error en el
  // árbol sintáctico que arma CodeMirror.
  private ubicarError(e: any): ErrorJson {
    const mensaje = String(e?.message || e || '');
    const doc = this.editor!.state.doc;
    let pos: number | null = null;

    const lineaColumna = mensaje.match(/line (\d+) column (\d+)/i);
    const posicion = mensaje.match(/position (\d+)/i);
    if (lineaColumna) {
      const linea = Math.min(Number(lineaColumna[1]), doc.lines);
      const infoLinea = doc.line(linea);
      pos = Math.min(infoLinea.from + Number(lineaColumna[2]) - 1, infoLinea.to);
    } else if (posicion) {
      pos = Number(posicion[1]);
    } else {
      pos = this.primerErrorSintactico();
    }

    if (pos === null) return { mensaje, pos: null, linea: null, columna: null, textoLinea: null };

    pos = Math.max(0, Math.min(pos, doc.length));
    const infoLinea = doc.lineAt(pos);
    const textoLinea = infoLinea.text.trim();
    return {
      mensaje,
      pos,
      linea: infoLinea.number,
      columna: pos - infoLinea.from + 1,
      textoLinea: textoLinea.length > 60 ? textoLinea.slice(0, 60) + '…' : textoLinea
    };
  }

  private primerErrorSintactico(): number | null {
    const state = this.editor!.state;
    const arbol = ensureSyntaxTree(state, state.doc.length, 2000);
    let encontrado: number | null = null;
    arbol?.iterate({
      enter: nodo => {
        if (encontrado !== null) return false;
        if (nodo.type.isError) {
          encontrado = nodo.from;
          return false;
        }
        return undefined;
      }
    });
    return encontrado;
  }

  volver() {
    this.navCtrl.back();
  }

  // Botón volver, gesto/botón físico de Android: si hay cambios sin
  // guardar, se pregunta antes de descartarlos.
  canDeactivate(): boolean | Promise<boolean> {
    if (!this.editor || this.texto === this.textoGuardado) return true;

    return new Promise<boolean>(resolve => {
      this.alertController.create({
        header: 'Cambios sin guardar',
        message: 'El JSON tiene cambios que no se han guardado. ¿Deseas salir y descartarlos?',
        backdropDismiss: false,
        buttons: [
          { text: 'Seguir editando', role: 'cancel', handler: () => resolve(false) },
          { text: 'Descartar', role: 'destructive', handler: () => resolve(true) }
        ]
      }).then(alert => alert.present());
    });
  }

}
