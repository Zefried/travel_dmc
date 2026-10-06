import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export type TimeSlot = {
    start: number;
    end: number;
};

export type ActivityItem = {
    id: number;
    name: string;
    startTime: number;
    duration: number;
    price: number;
};

export type DayPlan = {
    dayNumber: number;
    date: string;
    availableSlots: TimeSlot[];
    activities: ActivityItem[];
};

export type ItineraryState = {
    // Trip Config
    city: { id: number; name: string } | null;
    leavingOn: string;
    nights: number;
    travelers: string;

    // Selections
    hotel: { id: number; name: string; image?: string; starRating?: number } | null;
    room: { roomTypeId: number; roomId: number; roomName: string; pricePerNight: number } | null;
    
    // Day-by-Day Activities
    days: DayPlan[];
};

type Costs = {
    hotelTotal: number;
    dailyCosts: number[];
    activitiesTotal: number;
    grandTotal: number;
};

type ItineraryContextType = {
    state: ItineraryState;
    costs: Costs;
    setTripConfig: (city: { id: number; name: string } | null, leavingOn: string, nights: number, travelers: string) => void;
    setHotel: (hotel: { id: number; name: string; image?: string; starRating?: number } | null) => void;
    setRoom: (room: { roomTypeId: number; roomId: number; roomName: string; pricePerNight: number } | null) => void;
    addActivity: (dayIndex: number, activity: ActivityItem) => void;
    removeActivity: (dayIndex: number, activityId: number) => void;
    resetItinerary: () => void;
};

const initialState: ItineraryState = {
    city: null,
    leavingOn: "",
    nights: 1,
    travelers: "2 adults",
    hotel: null,
    room: null,
    days: [],
};

const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

export const ItineraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<ItineraryState>(() => {
        const saved = localStorage.getItem('itineraryState');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                
                if (parsed.city && parsed.city.id === 0) {
                    return initialState;
                }

                if (parsed.days) {
                    parsed.days = parsed.days.map((d: any) => ({
                        ...d,
                        activities: d.activities || [],
                        availableSlots: d.availableSlots || [{ start: 9, end: 21 }]
                    }));
                }
                return parsed;
            } catch (e) {
                console.error("Failed to parse itineraryState from localStorage");
            }
        }
        return initialState;
    });

    useEffect(() => {
        localStorage.setItem('itineraryState', JSON.stringify(state));
    }, [state]);

    const costs = useMemo<Costs>(() => {
        const hotelTotal = state.room ? state.room.pricePerNight * state.nights : 0;
        
        const dailyCosts = state.days.map(day => 
            day.activities.reduce((sum, act) => sum + Number(act.price), 0)
        );
        
        const activitiesTotal = dailyCosts.reduce((sum, cost) => sum + cost, 0);
        
        return {
            hotelTotal,
            dailyCosts,
            activitiesTotal,
            grandTotal: hotelTotal + activitiesTotal
        };
    }, [state]);

    const setTripConfig = (city: { id: number; name: string } | null, leavingOn: string, nights: number, travelers: string) => {
        setState(prev => {
            const days: DayPlan[] = [];
            const startDate = new Date(leavingOn);
            for (let i = 0; i < nights; i++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i);
                days.push({
                    dayNumber: i + 1,
                    date: date.toISOString().split('T')[0],
                    availableSlots: [{ start: 9, end: 21 }],
                    activities: []
                });
            }
            return {
                ...prev,
                city,
                leavingOn,
                nights,
                travelers,
                hotel: null,
                room: null,
                days
            };
        });
    };

    const setHotel = (hotel: { id: number; name: string; image?: string; starRating?: number } | null) => {
        setState(prev => ({
            ...prev,
            hotel,
            room: null // Reset room when hotel changes
        }));
    };

    const setRoom = (room: { roomTypeId: number; roomId: number; roomName: string; pricePerNight: number } | null) => {
        setState(prev => ({
            ...prev,
            room
        }));
    };

    const addActivity = (dayIndex: number, activity: ActivityItem) => {
        setState(prev => {
            const newDays = [...prev.days];
            if (newDays[dayIndex]) {
                const day = newDays[dayIndex];
                const actEnd = activity.startTime + activity.duration;
                
                // Find the slot that fits this activity
                const slotIndex = day.availableSlots.findIndex(
                    s => s.start <= activity.startTime && s.end >= actEnd
                );

                if (slotIndex !== -1) {
                    const slot = day.availableSlots[slotIndex];
                    const newSlots = [...day.availableSlots];
                    newSlots.splice(slotIndex, 1); // Remove original slot
                    
                    const buffer = 0.5; // 30 minutes
                    
                    // Add new split slots if there's leftover time, accounting for the buffer
                    if (slot.start <= activity.startTime - buffer) {
                        newSlots.push({ start: slot.start, end: activity.startTime - buffer });
                    }
                    if (actEnd + buffer <= slot.end) {
                        newSlots.push({ start: actEnd + buffer, end: slot.end });
                    }
                    
                    // Sort slots by start time
                    newSlots.sort((a, b) => a.start - b.start);

                    newDays[dayIndex] = {
                        ...day,
                        availableSlots: newSlots,
                        activities: [...day.activities, activity]
                    };
                }
            }
            return { ...prev, days: newDays };
        });
    };

    const removeActivity = (dayIndex: number, activityId: number) => {
        setState(prev => {
            const newDays = [...prev.days];
            if (newDays[dayIndex]) {
                const day = newDays[dayIndex];
                const activityToRemove = day.activities.find(a => a.id === activityId);
                
                if (activityToRemove) {
                    const actEnd = activityToRemove.startTime + activityToRemove.duration;
                    
                    let newSlots = [...day.availableSlots, { start: activityToRemove.startTime, end: actEnd }];
                    newSlots.sort((a, b) => a.start - b.start);
                    
                    // Merge adjacent/overlapping slots
                    const mergedSlots: TimeSlot[] = [];
                    for (const slot of newSlots) {
                        if (mergedSlots.length === 0) {
                            mergedSlots.push(slot);
                        } else {
                            const lastSlot = mergedSlots[mergedSlots.length - 1];
                            if (slot.start <= lastSlot.end) {
                                lastSlot.end = Math.max(lastSlot.end, slot.end);
                            } else {
                                mergedSlots.push(slot);
                            }
                        }
                    }

                    newDays[dayIndex] = {
                        ...day,
                        availableSlots: mergedSlots,
                        activities: day.activities.filter(a => a.id !== activityId)
                    };
                }
            }
            return { ...prev, days: newDays };
        });
    };

    const resetItinerary = () => {
        setState(initialState);
    };

    return (
        <ItineraryContext.Provider value={{ state, costs, setTripConfig, setHotel, setRoom, addActivity, removeActivity, resetItinerary }}>
            {children}
        </ItineraryContext.Provider>
    );
};

export const useItinerary = () => {
    const context = useContext(ItineraryContext);
    if (context === undefined) {
        throw new Error('useItinerary must be used within an ItineraryProvider');
    }
    return context;
};
