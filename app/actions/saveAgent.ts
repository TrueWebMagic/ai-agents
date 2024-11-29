'use server';

import { createClient } from '@/utils/supabase/server';

export const saveAgent = async (name: string, status: string, apis: Array<string>, workflow: { title: string; action: string }[], schedule: Array<string>, prompt: string) => {
    const supabase = await createClient();

    const { error } = await supabase
        .from('agents')
        .insert({ "name": name, "status": status, "apis": apis, "workflow": workflow, "schedule": schedule, "prompt": prompt })

    console.log(error)
}