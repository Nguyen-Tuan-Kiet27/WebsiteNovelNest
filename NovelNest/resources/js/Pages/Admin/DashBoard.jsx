import AdminLayout from '../../Layouts/AdminLayout';
export default function DashBoard({user}){
    return(
        <AdminLayout user={user} page={1} title='Thống kê'>
            hello
        </AdminLayout>
    )
}