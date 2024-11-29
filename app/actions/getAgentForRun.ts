'use server';

import { createClient } from '@/utils/supabase/server';

export const getAgentForRun = async (id: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('agents')
        .select("workflow, prompt")
        .eq("id", id)
        .single()

    if (error) {
        console.error("Error fetching data from agents:", error);
        return { error: error.message };
    }

    if (!data) {
        console.error("No agents found for the given ID");
        return { error: "No agents found" };
    }

    const { workflow, prompt } = data;

    return { workflow, prompt };
}