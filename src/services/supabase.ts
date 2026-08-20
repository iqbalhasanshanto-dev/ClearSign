import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveReportToSupabase(report: {
  title: string;
  analysis: string;
  criticalHits?: string;
  imageBase64?: string;
}) {
  const { data, error } = await supabase
    .from('reports')
    .insert([
      {
        title: report.title,
        analysis: report.analysis,
        critical_hits: report.criticalHits,
        image_base64: report.imageBase64,
      },
    ])
    .select();

  if (error) {
    console.error('Error saving report to Supabase:', error);
  }
  return data;
}

export async function fetchReportsFromSupabase() {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reports from Supabase:', error);
  }
  return data || [];
}