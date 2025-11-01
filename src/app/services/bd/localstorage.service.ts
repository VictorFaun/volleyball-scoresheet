import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  private readonly STORAGE_KEY = 'volleyball_app_data';

  /**
   * Saves data to localStorage
   * @param data The data to be saved (will be converted to JSON)
   */
  saveData(data: any): void {
    try {
      const jsonData = JSON.stringify(data);
      localStorage.setItem(this.STORAGE_KEY, jsonData);
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
      throw new Error('Failed to save data to localStorage');
    }
  }

  /**
   * Retrieves data from localStorage
   * @returns The parsed data or null if no data exists
   */
  getData(): any {
    try {
      const jsonData = localStorage.getItem(this.STORAGE_KEY);
      return jsonData ? JSON.parse(jsonData) : null;
    } catch (error) {
      console.error('Error retrieving data from localStorage:', error);
      return null;
    }
  }

  /**
   * Clears all data from localStorage for this app
   */
  clearData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
