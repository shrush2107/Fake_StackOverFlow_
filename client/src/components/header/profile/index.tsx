import React from 'react';
import { UserContext } from '../../../UserContext';
import { useContext } from 'react';

/**
 * Profile component that displays the user's username, email, about me, and LinkedIn link
 * @returns Profile component
 */
const Profile: React.FC = () => {
    const { user } = useContext(UserContext);
    console.log("Hello",user);
    return (
        <div>
           <div className="bold_title right_padding user_info">
                {user ? (
                <>   
                    <h1 className='username'>Welcome, {user.username}!</h1>
                    <p className='email'>Email: {user.email}</p>
                    <p className='aboutme'>About: {user.aboutme}</p>
                    <p className='linkedInLink'>LinkedIn: {user.linkedInLink}</p>
                </>
                ) : (
                <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default Profile;