'use server';

import { createClient } from '@/utils/supabase/server';

export const getAgents = async () => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('agents')
        .select('id, name, status');

    if (error) {
        console.error('Error inserting record:', error);
    } else {
        return data;
    }

}