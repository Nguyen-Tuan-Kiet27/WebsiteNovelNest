import { Head } from '@inertiajs/react';
export default function Home({user}) {
  return (
    <>
      <Head title="Trang chủ test" />
      <div>
        <h1>Hello, {user?.name || 'Guest'} - {user?.old || 0} year old</h1>
      </div>
    </>
  );
}
