import Dashboard from './dashboard';
import { TABLE_NAME } from '@/consts/consts';
import { supabase } from '@/lib/supabaseClient';

export const metadata = {
  title: 'Dashboard / Notedown',
};

export const revalidate = 0;
const getServerSideProps = async () => {
  const { data } = await supabase.from(TABLE_NAME).select('name, notes');

  return {
    props: {
      notesFromServer: data,
    },
  };
};

export const dynamic = 'force-static';

const DashboardPage = async () => {
  const { props } = await getServerSideProps();
  return <Dashboard {...props} />;
};

export default DashboardPage;
