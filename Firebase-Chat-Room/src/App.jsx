// App.jsx
import { signOut } from "firebase/auth"; // Firebase sign-out function
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from '../firebase-config'; // Firebase authentication configuration
import Auth from "./componets/Auth"; // Authentication component
import JoinRoom from "./componets/JoinRoom/JoinRoom"; // Chat room component

function App() {
   // State to track if user is authenticated
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   // State to store the user's unique ID
   const [uid, setUid] = useState(null);

   // Monitor changes in user authentication status
   useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
         if (user) {
            // User is signed in, update states
            setIsAuthenticated(true);
            setUid(user.uid);
         toast.success('Logged In successfully')

         } else {
            // User is signed out, reset states
            setIsAuthenticated(false);
            setUid(null);

         }
      });
      
      // Stop observing authentication status when component unmounts
      return () => unsubscribe();
   }, []);

   // Function to handle user logout
   const logout = async () => {
      try {
         await signOut(auth); // Sign out the user
         console.log("User logged out successfully");
         toast.warning('Logged out successfully')
         setIsAuthenticated(false); // Update state to reflect logged-out status
         setUid(null); // Clear the stored user ID
      } catch (error) {
         console.error("Error signing out: ", error); // Log any errors
      }
   };

   return (
      <div>
         <ToastContainer></ToastContainer>
         {isAuthenticated ? (
            // If authenticated, show chat room component
            <JoinRoom uid={uid} logout={logout} />
         ) : (
            // If not authenticated, show login component
            <Auth setAuth={setIsAuthenticated} />
         )}
      </div>
   );
}

export default App;
