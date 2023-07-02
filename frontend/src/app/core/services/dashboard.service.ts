import { Injectable } from "@angular/core";
import { Observable, delay, of } from "rxjs";
import { ApiService } from "./api.service";
import { Patient } from "../models";
import * as uuid from "uuid";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  today = new Date();
  constructor(private apiSvc: ApiService) {}

  getPatientData(): Observable<Patient[]> {
    // return this.apiSvc.get("/patient");

    const patientData = this.generatePatientData();
    return of(patientData).pipe(delay(200));
  }

  getStartAndEndOfWeek() {
    const currentDate = this.today;
    const currentDay = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
    const startOfWeek = new Date(currentDate); // Clone the current date object
    const endOfWeek = new Date(currentDate); // Clone the current date object

    startOfWeek.setDate(currentDate.getDate() - currentDay); // Move to the first day (Sunday) of the current week
    endOfWeek.setDate(currentDate.getDate() + (6 - currentDay)); // Move to the last day (Saturday) of the current week

    // Adjust to the beginning of the day (00:00:00) and end of the day (23:59:59)
    startOfWeek.setHours(0, 0, 0, 0);
    endOfWeek.setHours(23, 59, 59, 999);

    return {
      startOfWeek,
      endOfWeek,
    };
  }

  generatePatientData(): Patient[] {
    const $this = this;
    function randomDate(
      start: any,
      end: any,
      startHour: number,
      endHour: number
    ) {
      const date = new Date(+start + Math.random() * (end - start));
      const hour = (startHour + Math.random() * (endHour - startHour)) | 0;
      date.setHours(hour);
      return date;
    }
    function generateRandomValues(startDate: any) {
      const today = new Date();
      const daysDiff = Math.floor(
        (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const plannedReadings = [];
      const actualReadings = [];

      let currentWeekStart = new Date(startDate);
      currentWeekStart.setDate(startDate.getDate() - startDate.getDay()); // Get the start of the first week (Sunday)

      while (currentWeekStart <= today) {
        const currentWeekEnd = new Date(currentWeekStart);
        currentWeekEnd.setDate(currentWeekEnd.getDate() + 6); // Get the end of the current week (Saturday)

        const weekId = uuid.v4();
        const plannedReadingCount = Math.floor(Math.random() * 10) + 1; // Random planned reading count (1 to 10)
        plannedReadings.push({
          weekId,
          startDate: currentWeekStart.toISOString(),
          endDate: currentWeekEnd.toISOString(),
          plannedReadingCount: plannedReadingCount,
        });

        const readingsForWeek = [];
        for (let i = 0; i < plannedReadingCount; i++) {
          if (Math.random() < 0.8) {
            // 80% chance of recording a reading for this week
            const readingTime = new Date(currentWeekStart);
            readingTime.setHours(Math.floor(Math.random() * 24)); // Random hour (0 to 23)
            readingTime.setMinutes(Math.floor(Math.random() * 60)); // Random minute (0 to 59)
            const readingValue = Math.random() * 100; // Random reading value (0 to 100)
            readingsForWeek.push({
              readingTime: readingTime.toISOString(),
              readingValue: readingValue,
            });
          }
        }

        actualReadings.push({
          weekId,
          date: currentWeekStart.toISOString(), // Use the first day of the week as the date for actual readings
          readings: readingsForWeek,
        });

        currentWeekStart.setDate(currentWeekStart.getDate() + 7); // Move to the next week
      }

      return {
        planned: plannedReadings,
        actual: actualReadings,
      };
    }

    function getRandomNumber(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to generate random call logs
    function generateRandomCallLogs(numLogs: number, minTimes: any) {
      const callLogs = [];

      // Time range in milliseconds (from 1st Jan 2023 00:00:00 to 1st Feb 2023 23:59:59)
      const minTime = minTimes.getTime();
      const maxTime = $this.today.getTime();

      for (let i = 0; i < numLogs; i++) {
        const callTime = new Date(getRandomNumber(minTime, maxTime));
        const callDuration = getRandomNumber(1, 60); // Duration in minutes

        const callLog = {
          time: callTime.toISOString(),
          duration: callDuration,
        };

        callLogs.push(callLog);
      }

      return callLogs;
    }

    function generateVisits(numLogs: number, minTimes: any) {
      let randomVisits = [];
      const minTime = minTimes.getTime();
      const maxTime = $this.today.getTime();

      for (let i = 0; i < numLogs; i++) {
        const visitDate = new Date(getRandomNumber(minTime, maxTime));

        const visit = {
          visitDate: visitDate.toISOString(),
          visitDetails: "",
        };

        randomVisits.push(visit);
      }
      return randomVisits;
    }

    const data: Patient[] = [];
    let i = 0;
    while (i < 10000) {
      const startDate = new Date("2023-05-01");
      const entryTime = randomDate(startDate, this.today, 0, 24);
      data.push({
        patientId: uuid.v4(),
        entryTime: entryTime.toISOString(),
        readings: generateRandomValues(entryTime),
        callLogs: generateRandomCallLogs(
          Math.floor(Math.random() * 10),
          entryTime
        ),
        isActive: Math.floor(Math.random() * 2) == 0 ? false : true,
        visits: generateVisits(Math.floor(Math.random() * 5), entryTime),
      });
      i++;
    }

    return data;
  }
}
