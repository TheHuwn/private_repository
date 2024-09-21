// Import the functions you need from the SDKs you need 
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUcVQC9DmWhSywqzfnYKwojdihEYpZYYU",
  authDomain: "lotteria-test-app.firebaseapp.com",
  projectId: "lotteria-test-app",
  storageBucket: "lotteria-test-app.appspot.com",
  messagingSenderId: "162316377094",
  appId: "1:162316377094:web:36ec9dab45413c8f31f787",
  measurementId: "G-7YH1W9P95B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    localStorage.removeItem("userInfo");

    const result = await signInWithPopup(auth, provider);
    if (!result || !result.user) {
      throw new Error("No user information received from Google.");
    }
    const user = result.user;

    const userInfo = {
      fullName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };

    // Kiểm tra xem tài khoản đã tồn tại trong db.json chưa
    const checkUserResponse = await fetch(
      `http://localhost:5000/users?email=${user.email}`
    );
    const existingUsers = await checkUserResponse.json();

    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      localStorage.setItem("userInfo", JSON.stringify(existingUser));
      console.log("Existing user logged in:", existingUser);
      return existingUser;
    } else {
      // Tạo tài khoản mới
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        throw new Error("Failed to save user data to the server.");
      }

      const newUser = await response.json();
      localStorage.setItem("userInfo", JSON.stringify(newUser));
      console.log("New user created and logged in:", newUser);
      return newUser;
    }
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    alert("Đăng nhập bằng Google không thành công, vui lòng thử lại.");
    throw error;
  }
};

// Đăng ký tài khoản bằng email và mật khẩu và lưu vào db.json
export const registerWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Gửi email xác minh
    await sendEmailVerification(user);
    alert("Đăng ký thành công! Kiểm tra email của bạn để xác minh.");

    // Tạo thông tin người dùng và lưu vào db.json
    const userInfo = {
      fullName: email.split('@')[0], // Tạo tên từ phần trước @
      email: user.email,
      photoURL: "", // Chưa có ảnh
    };

    const response = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
      throw new Error("Failed to save user data to the server.");
    }

    const newUser = await response.json();
    localStorage.setItem("userInfo", JSON.stringify(newUser));
    console.log("New user registered:", newUser);

    return newUser;
  } catch (error) {
    console.error("Error registering with email:", error);
    alert(error.message);
  }
};

// Đăng nhập bằng email và mật khẩu
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Kiểm tra xem tài khoản đã tồn tại trong db.json chưa
    const checkUserResponse = await fetch(
      `http://localhost:5000/users?email=${user.email}`
    );
    const existingUsers = await checkUserResponse.json();

    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      localStorage.setItem("userInfo", JSON.stringify(existingUser));
      return existingUser;
    } else {
      const userInfo = {
        fullName: email.split('@')[0],
        email: user.email,
        photoURL: "",
      };

      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        throw new Error("Failed to save user data to the server.");
      }

      const newUser = await response.json();
      localStorage.setItem("userInfo", JSON.stringify(newUser));
      return newUser;
    }
  } catch (error) {
    console.error("Error signing in:", error);
    alert(error.message);
  }
};

// Quên mật khẩu
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.");
  } catch (error) {
    console.error("Error sending password reset:", error);
    alert(error.message);
  }
};

// Đăng xuất
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    localStorage.removeItem("userInfo");
    alert("Đã đăng xuất thành công!");
  } catch (error) {
    console.error("Sign-out Error:", error);
    alert("Đăng xuất không thành công, vui lòng thử lại.");
  }
};

export { auth };
