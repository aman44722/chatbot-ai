import '../../../../pages/SetupPage/AdminSettings.css';
import { EditChatBotSettings, fetchUserById, updateUserDetails } from '../../../../api/authApi';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';

export default function ProfileDetails() {
    const [user, setUser] = useState({
        email: '',
        fullName: '',
        website: '',
        phone: '',
        gst: '',
    });
    const labelStyle = {
        display: "flex",
        alignItems: "center",
        fontSize: "13px",
        color: "#999",

        fontWeight: 600,
    };

    const inputStyle = {
        width: "100%",
        padding: "10px 12px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
        marginTop: '15px'
    };


    // Get Api Call
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        // console.log("userId", userId);

        if (!userId) return;

        const registerUser = async () => {
            try {
                const userData = await fetchUserById(userId);  // Fetching user data via the API
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        registerUser();
    }, []);

    // Put Api Call
    const handleUpdate = async () => {
        try {
            const response = await updateUserDetails(user); // Assuming `updateUserDetails` is your API call
            if (response.user) {
                toast.success("User info updated successfully!")
            } else {
                toast.error("Failed to update user info. Please try again!");
            }
        } catch (error) {
            console.error("Error updating user info", error);
            toast.error("Update failed! Something went wrong.");
        }
    };


    return (
        <div
            className="custom-scrollbar"
            style={{
                display: 'flex',
                justifyContent: 'start',
                gap: '40px',
                boxShadow: '0px 4px 20px #d8d8d8',
                borderRadius: '20px',
                borderRight: '1px solid #eee',
                overflowY: 'auto',
                width: '100%'
            }}

        >
            {user && (
                <div className="mock-browser-layout" style={{ display: 'flex', flexDirection: 'column', width: '80%', gap: '30px' }}>
                    <div>
                        <label style={labelStyle} htmlFor="email">Email</label>
                        <input style={inputStyle} type="email" id="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                    </div>
                    <div>
                        <label style={labelStyle} htmlFor="fullName">Full Name</label>
                        <input style={inputStyle} type="text" id="fullName" value={user.fullName} onChange={(e) => setUser({ ...user, fullName: e.target.value })} />
                    </div>
                    <div>
                        <label style={labelStyle} htmlFor="website">Website URL</label>
                        <input style={inputStyle} type="text" id="website" value={user.website} onChange={(e) => setUser({ ...user, website: e.target.value })} />
                    </div>
                    <div>
                        <label style={labelStyle} htmlFor="phone">Phone Number</label>
                        <input style={inputStyle} type="tel" id="phone" value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} />
                    </div>
                    <div>
                        <label style={labelStyle} htmlFor="gst">GST Number</label>
                        <input style={inputStyle} type="text" id="gst" value={user.gst} onChange={(e) => setUser({ ...user, gst: e.target.value })} />
                    </div>
                    <button onClick={handleUpdate} style={{ background: '#4F46E5', color: '#fff', padding: '10px 25px', borderRadius: '8px', border: 'none', cursor: 'pointer' }} type="button">Update</button>
                    <ToastContainer />

                    {/* <button style={{ background: '#4F46E5', color: '#fff', padding: '10px 25px', borderRadius: '8px', border: 'none' }} type="button">Save</button> */}
                </div>
            )}

            <div style={{ width: "100%", height: '50%', }}>
                <h4 style={{ marginBottom: '20px' }}>Your Plan Details</h4>
                <div style={{ boxShadow: '0px 4px 20px #d8d8d8', display: 'flex', flexDirection: 'column', borderRadius: '10px', gap: '1rem', marginRight: '20%', padding: '20px' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <label>Current Plan <span>:</span></label>
                        <label><strong>Pro</strong></label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <label>Number of Bots <span>:</span></label>
                        <label><strong>10 (9 left)</strong></label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <label>Number of Chats <span>:</span></label>
                        <label><strong>500 (4990 left)</strong></label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <label>Subscription Start Date <span>:</span></label>
                        <label><strong>Jul 16th 2025</strong></label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <label>Subscription End Date <span>:</span></label>
                        <label><strong>Jul 30th 2025</strong></label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <label>Subscription Duration <span>:</span></label>
                        <label><strong>2 Days</strong></label>
                    </div>
                </div>


            </div>



        </div >
    );
}
