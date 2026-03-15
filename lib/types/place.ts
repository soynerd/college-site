export interface Place {
    id: number
    name: string
    image: string
    distanceKm: number
    budget: "Free" | "0-200" | "200-500" | "500+"
    groupSize: string[]
    weather: string[]
    timeRequired: "1-2h" | "Half Day" | "Full Day"
    energy: "Chill" | "Moderate" | "Active"
    crowd: "Peaceful" | "Moderate" | "Crowded"
    mood: string[]
    trending: boolean
    mapsUrl: string
    description: string
    rating: number        // float
    ratingCount: number   // total votes
}