'use server'

import { Databases, ID, Query } from "node-appwrite"
import { APPOINTMENT_COLLECTION_ID, BUCKET_ID, database, DATABASE_ID, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils"
import { Appointment } from "@/types/appwrite.types"
import { revalidatePath } from "next/cache"

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        const newAppointment = await database.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
        )

        console.log("New appointment created:", newAppointment);
        console.log("DATABASE_ID:", DATABASE_ID);
        console.log("APPOINTMENT_COLLECTION_ID:", APPOINTMENT_COLLECTION_ID);
        console.log("Appointment Data:", appointment);

        return parseStringify(newAppointment);
    } catch (error) {
        console.log("create appointment error : ", error);
        return null;
    }
}

export const getAppointment = async (appointmentId : string) => {
    try {
        const appointmet = await database.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId
        )

        return parseStringify(appointmet);
    } catch (error) {
        console.error("get appointment error : ", error);
    }
}

export const getRecentAppointmentList = async () => {
    try {
        const appointments = await database.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')]
        )

        const initialCounts = {
            scheduleCount: 0,
            pendingCount: 0,
            cancelledCount: 0
        }
        
        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
            if (appointment.status === 'scheduled') {
                acc.scheduleCount += 1;
            } else if (appointment.status === 'pending') {
                acc.pendingCount += 1;
            } else if (appointment.status === 'cancelled') {
                acc.cancelledCount += 1;
            }
            return acc;
        }, initialCounts);

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents
        }

        return parseStringify(data);

    } catch (error) {
        console.error("get recent appointment list error : ", error);
    }
}

export const updateAppointment = async ({appointmentId, userId, appointment, type} : UpdateAppointmentParams) => {
    try {
        const updatedAppointment = await database.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
            appointment
        )

        if (!updateAppointment){
            throw new Error('Appointment nor found!');
        }

        // TODO SMS NOTIFICATION
        
        revalidatePath('/admin');
        return parseStringify(updatedAppointment);

    } catch (error) {
        console.error("update appointment error : ", error);
    }
}