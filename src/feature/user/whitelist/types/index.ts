// src/types/index.ts

export interface Event {
    id: number;
    title: string;
    start_date: string; // ISO 8601 date string
    location: string;
    picture: string;
}