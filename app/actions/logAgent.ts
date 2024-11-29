'use server';

import { createClient } from '@/utils/supabase/server';

export const logAgent = async (id: string, steps_results: { [key: string]: string; }, workflow_arguments: Array<string>) => {
    const supabase = await createClient();

    const { error } = await supabase
        .from('agent_executions')
        .insert({ "agent_id": id, "steps_results": steps_results, "arguments": workflow_arguments })

    console.log(error)
}