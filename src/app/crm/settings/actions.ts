"use server";

import { updateWorkspaceSettings, updatePassword } from "@/lib/services";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

export async function saveSettingsAction(formData: FormData) {
    const agencyName = formData.get("agencyName") as string;
    const webhookUrl = formData.get("webhookUrl") as string;
    const primaryColor = formData.get("primaryColor") as string;
    const calendlyUrl = formData.get("calendlyUrl") as string;

    const success = await updateWorkspaceSettings(agencyName, webhookUrl, primaryColor, calendlyUrl);
    if (success) {
        revalidatePath("/crm/settings");
        revalidatePath("/crm"); // Revalidate sidebar if we use agency name there
        return { success: true };
    }
    return { success: false, error: "Error al guardar la configuración" };
}

export async function changePasswordAction(formData: FormData) {
    const session = await getServerSession();
    if (!session?.user?.email) return { success: false, error: "No autenticado" };

    const currentPass = formData.get("currentPassword") as string;
    const newPass = formData.get("newPassword") as string;
    const confirmPass = formData.get("confirmPassword") as string;

    if (newPass !== confirmPass) {
        return { success: false, error: "Las contraseñas nuevas no coinciden" };
    }

    // Since we only have one admin for now, we'll get by email
    // In a multi-user system, we'd use the ID from the token
    const result = await updatePassword("1", currentPass, newPass); // Hardcoded ID 1 for first admin
    return result;
}
