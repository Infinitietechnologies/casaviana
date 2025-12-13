import { login } from "@/Api/api";
import { setLogin } from "@/store/authSlice";
import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  toast,
  useDisclosure,
} from "@heroui/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const LoginModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (onClose) => {
    try {
      setLoading(true);

      const res = await login({
        username,
        password,
        type: "username",
      });
      // Dispatch the actual user object. `login()` returns response.data
      // which contains `{ user, token, ... }`.
      const userPayload = res?.user || res?.data?.user || res;
      dispatch(setLogin(userPayload));
      // Optional: Store token separately if needed (e.g., for API headers)
      // localStorage.setItem('authToken', res.data.token);
      addToast({
        title: res?.message || "Logged in",
        color: "success",
      });
      onClose();
      // Optional: Clear form
      setUsername("");
      setPassword("");
    } catch (err) {
      addToast({
        title: err?.response?.data?.message || "Something went wrong",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        Login
      </Button>

      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>

              <ModalBody>
                <Input
                  // endContent={<MailIcon className="text-2xl text-default-400" />}
                  label="Username"
                  placeholder="Enter your username"
                  variant="bordered"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <Input
                  // endContent={<LockIcon className="text-2xl text-default-400" />}
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  variant="bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>

                <Button
                  color="primary"
                  isLoading={loading}
                  onPress={() => handleLogin(onClose)}
                >
                  Sign in
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoginModal;
