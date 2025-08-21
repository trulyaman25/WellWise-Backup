import { Outlet, useParams } from "react-router-dom";
import DashboardNavbar from "./navigation/patientNavigation";
import { PatientDataProvider } from './dataProvider/PatientDataProvider';

function PatientDashboardLayout() {
    const { healthID } = useParams();
    return (
        <div className="flex">
            <div className="fixed left-0 w-[450px]">
                <DashboardNavbar />
            </div>

            <div className="ml-[350px] w-full z-10">
                <PatientDataProvider healthID={healthID}>
                    <Outlet />
                </PatientDataProvider>
            </div>
        </div>
    );
}

export default PatientDashboardLayout;