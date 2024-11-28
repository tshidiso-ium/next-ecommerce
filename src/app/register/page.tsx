"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import SignUserIn from "@/lib/signin";
import RegisterUser from "@/lib/register";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

enum MODE {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  RESET_PASSWORD = "RESET_PASSWORD",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

const RegisterPage: React.FC = () => {
	const router = useRouter();

	const [mode, setMode] = useState<MODE>(MODE.REGISTER);
	const [username, setUsername] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [emailCode, setEmailCode] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [message, setMessage] = useState<string>("");

	const formTitle =
		mode === MODE.LOGIN
			? "Log in"
			: mode === MODE.REGISTER
			? "Register"
			: mode === MODE.RESET_PASSWORD
			? "Reset Your Password"
			: "Verify Your Email";

	const buttonTitle =
		mode === MODE.LOGIN
			? "Login"
			: mode === MODE.REGISTER
			? "Register"
			: mode === MODE.RESET_PASSWORD
			? "Reset"
			: "Verify";

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			let response;
			switch (mode) {
				case MODE.LOGIN:
          response = await signInAndVerify(email, password);
					if (response.data.uid) {
            console.log("Login successful! Redirecting...");
            localStorage.setItem("userID", response.data.uid);
            localStorage.setItem("idToken", response.idToken);
						setMessage("Login successful! Redirecting...");
						router.push("/");
					} else {
						setError("Invalid email or password!");
					}
					break;
				case MODE.REGISTER:
					// Add registration logic if needed
					response = await handleRegister(username, email, password);
					console.log("respons from registering: ", response);
					// console.log("Login successful! Redirecting...");
					break;
				case MODE.RESET_PASSWORD:
					setMessage("Password reset email sent. Please check your e-mail.");
					break;
				case MODE.EMAIL_VERIFICATION:
					// Add email verification logic if needed
					break;
				default:
					break;
			}
		} catch (err) {
			setError("Something went wrong!");
		} finally {
			setIsLoading(false);
		}
	};

interface UserImpl {
	uid: string;
	email: string;
	emailVerified: boolean;
	isAnonymous: boolean;
	displayName: string | null;
	photoURL: string | null;
	phoneNumber: string | null;
	providerId: string | null;
}

interface UserDetails {
	operationType: string;
	providerId: string | null;
	user: UserImpl;
	accessToken: string;
	auth: any; // Adjust the 'auth' type as needed based on your implementation
	email: string;
	emailVerified: boolean;
	isAnonymous: boolean;
	_tokenResponse: TokenResponse;
}

interface TokenResponse {
	displayName: string;
	email: string;
	expiresIn: string;
	idToken: string;
	kind: string;
	localId: string;
	refreshToken: string;
	registered: boolean;
}

interface Res {
	error: string | null;
	result: UserDetails;
}

function isUserDetails(details: unknown): details is Res {
	// Type guard to ensure the object conforms to the Res structure
	// Make sure details is an object and has the expected shape
	if (typeof details !== "object" || details === null) {
		return false;
	}

	const detailsAsRes = details as Res;

	// Check if 'result' exists and if 'user' inside 'result' has a 'uid'
	return (
		"result" in detailsAsRes &&
		detailsAsRes.result !== null &&
		"user" in detailsAsRes.result &&
		detailsAsRes.result.user?.uid !== undefined
	);
}

async function signInAndVerify(email: string, password: string) {
	const userDetails: unknown = await SignUserIn(email, password);

	if (isUserDetails(userDetails) && userDetails.result.user?.uid) {
		const response = await verifyUser(
			userDetails.result._tokenResponse.idToken
		);
		console.log("response: ", response);
		return response;
	} else {
		console.error("Invalid user details or UID is missing.");
		return "error";
	}
}

async function handleRegister(userName: string, email: string, password: string){
    try {
			if(userName !== "" && email !== "" && password !== ""){
				const userCreatedStatus = await createUser(userName, email, password);
				if (userCreatedStatus.error) {
					setMessage(userCreatedStatus.error);
					// Redirect to the admin overview page after a delay to allow the popup to be seen
					// setTimeout(() => {
					// 	setStateModal({ showModal: false, text: "", title: "", icon: "" });
					// }, 3000); // Adjust the delay as needed
				} else if (userCreatedStatus.results && userCreatedStatus.userId) {
					console.log("user created successfuly");
					setMessage("User successfuly created");
					// Redirect to the admin overview page after a delay to allow the popup to be seen
					// setTimeout(() => {
					// 	setStateModal({ showModal: false, text: "", title: "", icon: "" });
					// 	router.push(`/employeeDetailsForm?id=${userCreatedStatus.userId}`);
					// }, 3000); // Adjust the delay as needed
				}
			}
			else{
				console.log("Please fill in all the missing info");
			}

		} catch (err) {
			console.log("New User handleSubmit: Error");
			console.log(err);
			throw err;
		}
}

	return (
		<div className="h-[calc(100vh-80px)] flex items-center justify-center bg-[url('https://firebasestorage.googleapis.com/v0/b/my-profile-95716.firebasestorage.app/o/custom-nike-blazers-1.jpg?alt=media&token=8c9b24e8-86f1-4270-867d-3faa7918faf4')] bg-cover bg-top -mt-20">
			<form
				className="flex flex-col gap-8 p-8 border-b-2 rounded-t-sm bg-white/30 backdrop-blur-lg shadow-lg"
				onSubmit={handleSubmit}
			>
				<h1 className="text-2xl font-semibold">{formTitle}</h1>
				{mode === MODE.REGISTER && (
					<input
						type="text"
						name="username"
						placeholder="Username"
						className="input border-b-2 rounded-t-sm p-2"
						onChange={(e) => setUsername(e.target.value)}
					/>
				)}
				{mode !== MODE.EMAIL_VERIFICATION ? (
					<input
						type="email"
						name="email"
						placeholder="Email"
						className="input border-b-2 rounded-t-sm p-2"
						onChange={(e) => setEmail(e.target.value)}
					/>
				) : (
					<input
						type="text"
						name="emailCode"
						placeholder="Verification Code"
						className="input border-b-2 rounded-t-sm"
						onChange={(e) => setEmailCode(e.target.value)}
					/>
				)}
				{(mode === MODE.LOGIN || mode === MODE.REGISTER) && (
				<div className="relative w-full">
					<input
						type={showPassword ? "text" : "password"}
						name="password"
						placeholder="Password"
						className="input border-b-2 rounded-t-sm w-full p-2"
						onChange={(e) => setPassword(e.target.value)}
						value={password}
					/>
					<div
						className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
						onClick={() => setShowPassword(!showPassword)}
					>
						{showPassword ? (
						<EyeSlashIcon className="h-5 w-5 text-gray-500" />
						) : (
						<EyeIcon className="h-5 w-5 text-gray-500" />
						)}
					</div>
				</div>
				)}
				<button
					className="button bg-pink-600 text-white rounded-sm p-2"
					disabled={isLoading}
				>
					{isLoading ? "Loading..." : buttonTitle}
				</button>
				{error && <div className="text-red-600 flex w-full">{error}</div>}
				{message && (
					<div className="text-green-600 text-sm flex w-full">{message}</div>
				)}
			</form>
		</div>
	);
};


const verifyUser = async (idToken: string): Promise<any> => {
  try {
    console.log("idToken: ", idToken);
    const url = new URL("http://localhost:3100/verifyUser");
    url.searchParams.append("idToken", idToken);

    const res = await fetch(url.toString(), {
      method: "GET", // Use POST for sensitive data
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!res.ok) {
      console.log("verify user: ", res.ok);
      throw new Error("Failed to login");
    }

    const data = await res.json();
    return {data, idToken};
  } catch (err) {
    console.error("verifyUser: Error", err);
    throw err;
  }
};

const createUser = async (userName: string, email: string, password: string ) : Promise<any>=> {
  try {
    const url = new URL("http://localhost:3100/createUser");
    const res = await fetch(url, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${password}`,
			},
			body: JSON.stringify({
				fullName: userName,
				email: email,
			}),
		});
    console.log(res.status);
    if (res.status === 401 || res.status === 404) {
      const data = await res.json();
      return { error: data.message };
    }
    const data = await res.json();
    console.log(data);
    return await data;
  } catch (err) {
    console.log("New User createUser: Error ",err);
    throw err;
  }
};

export default RegisterPage;
