import {
  addDoc,
  collection,
} from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppState } from "../../context/app-state-context";
import {
  getUsers,
  signInWithEmailAndPassword,
  signInWithGithub,
  signInWithGoogle,
} from "../../services/firebase";

const Login = ({ database }) => {
  const navigate = useNavigate();
  const {setAppState} = useAppState()
  const [values, setValues] = useState({ username: "", password: "" });
  const userRef = collection(database, "users");

  const handleEmailInputChange = (e) => {
    setValues({ ...values, username: e.target.value });
  };

  const handlePasswordInputChange = (e) => {
    setValues({ ...values, password: e.target.value });
  };

  const addUser = async (user) => {
    getUsers().then((users) => {
      const userExist =
        users?.filter((u) => u.email === user.email)?.length > 0;

      if (!userExist) {
        addDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoUrl: user.photoURL,
        })
          .then(() => {
            toast.success("User Added");
            setAppState({user: user, isLoggedIn: true});
            navigate("/presentation");
          })
          .catch(() => {
            toast.error("Cannot addUser");
          });
      } else {
        setAppState({user: user, isLoggedIn: true});
        navigate("/presentation");
      }
    });
   
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(values.username, values.password).then((data) => {
      const user = data.user;
      addUser({uid: user.uid, displayName: user.displayName, email: user.email, photoURL: user.photoURL});
    });
  };

  const onClickSignInWithGoogle = () => {
    signInWithGoogle().then((data) => {
      const user = data.user;
      addUser({uid: user.uid, displayName: user.displayName, email: user.email, photoURL: user.photoURL});
    });
  };

  const onClickSignInWithGithub = () => {
    signInWithGithub().then((data) => {
      const user = data.user;
      addUser({uid: user.uid, displayName: user.displayName, email: user.email, photoURL: user.photoURL});
    });
  };

  return (
    <div className="flex h-screen justify-center">
      <div className="lg:w-1/3 space-y-2 w-5/6">
        <form
          className="bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-2"
          onSubmit={handleSubmit}
        >
          <h1 className="text-center text-xl mb-4">Login</h1>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              value={values.username}
              onChange={handleEmailInputChange}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={values.password}
              onChange={handlePasswordInputChange}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
        <button
          className="w-full bg-white p-4 rounded"
          onClick={onClickSignInWithGoogle}
        >
          <div className="flex justify-center items-center space-x-4 mx-2">
            <div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/768px-Google_%22G%22_Logo.svg.png"
                className="w-8 h-8 "
                alt="Google"
              />
            </div>
            <div>Login with Google</div>
          </div>
        </button>
        <button
          className="w-full bg-black text-white p-4 rounded"
          onClick={onClickSignInWithGithub}
        >
          <div className="flex justify-center items-center space-x-4 mx-2">
            <div>
              <img
                src="https://icon-library.com/images/github-icon-white/github-icon-white-6.jpg"
                className="w-10 h-10"
                alt="Github"
              />
            </div>
            <div>Login with Github</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Login;
