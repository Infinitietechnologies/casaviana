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

      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
      const payload = {
        password,
        type: isEmail ? "email" : "username",
        [isEmail ? "email" : "username"]: username,
      };

      const res = await login(payload);
      const userPayload = res?.user || res?.data?.user || res;

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userPayload));
      }

      dispatch(setLogin(userPayload));

      addToast({
        title: res?.message || "Logged in successfully",
        color: "success",
      });

      onClose();

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
                  label="Username or Email"
                  placeholder="Enter your username or email"
                  variant="bordered"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <Input
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  variant="bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </ModalBody>

              <ModalFooter>
                <Button color="" variant="flat" onPress={onClose}>
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
