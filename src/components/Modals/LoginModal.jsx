import { login, register, get_cart } from "@/Api/api";
import { setLogin } from "@/store/authSlice";
import { setCart } from "@/store/cartSlice";
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
  Tabs,
  Tab,
  DatePicker,
} from "@heroui/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { today, getLocalTimeZone } from "@internationalized/date";

const LoginModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const dispatch = useDispatch();

  // Login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Register state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdate, setBirthdate] = useState(null);
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // Password visibility toggles
  const [isLoginPasswordVisible, setIsLoginPasswordVisible] = useState(false);
  const [isRegisterPasswordVisible, setIsRegisterPasswordVisible] =
    useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const toggleLoginPasswordVisibility = () =>
    setIsLoginPasswordVisible(!isLoginPasswordVisible);
  const toggleRegisterPasswordVisibility = () =>
    setIsRegisterPasswordVisible(!isRegisterPasswordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

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

      // Fetch cart after login
      try {
        const cartRes = await get_cart();
        if (cartRes?.success && cartRes.data) {
          dispatch(
            setCart({
              items: cartRes.data.items || [],
              cart_id: cartRes.data.id || null,
              final_total: cartRes.final_total || 0,
            }),
          );
        }
      } catch (error) {
        console.error("Failed to fetch cart after login", error);
      }

      addToast({
        title: res?.message || "Login efetuado com sucesso",
        color: "success",
      });

      onClose();

      setUsername("");
      setPassword("");
    } catch (err) {
      addToast({
        title: err?.response?.data?.message || "Algo correu mal",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (onClose) => {
    try {
      setLoading(true);

      // Validation
      if (!name || !email || !phone || !registerPassword || !confirmPassword) {
        addToast({
          title: "Por favor, preencha todos os campos",
          color: "warning",
        });
        return;
      }

      // Validate birthdate if provided
      if (birthdate) {
        const todayDate = today(getLocalTimeZone());
        if (birthdate.compare(todayDate) >= 0) {
          addToast({
            title: "A data de nascimento deve ser anterior a hoje",
            color: "danger",
          });
          return;
        }
      }

      if (registerPassword !== confirmPassword) {
        addToast({
          title: "As palavras-passe não coincidem",
          color: "danger",
        });
        return;
      }

      const payload = {
        name,
        email,
        phone,
        password: registerPassword,
        password_confirmation: confirmPassword,
      };

      // Add birthdate if provided (format: YYYY-MM-DD)
      if (birthdate) {
        payload.birthdate = birthdate.toString();
      }

      const res = await register(payload);
      const userPayload = res?.user || res?.data?.user || res;

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userPayload));
      }

      dispatch(setLogin(userPayload));

      // Fetch cart after registration
      try {
        const cartRes = await get_cart();
        if (cartRes?.success && cartRes.data) {
          dispatch(
            setCart({
              items: cartRes.data.items || [],
              cart_id: cartRes.data.id || null,
              final_total: cartRes.final_total || 0,
            }),
          );
        }
      } catch (error) {
        console.error("Failed to fetch cart after registration", error);
      }

      addToast({
        title: res?.message || "Registado com sucesso",
        color: "success",
      });

      onClose();

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setBirthdate(null);
      setRegisterPassword("");
      setConfirmPassword("");
    } catch (err) {
      addToast({
        title: err?.response?.data?.message || "Algo correu mal",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press for login
  const handleLoginKeyPress = (e, onClose) => {
    if (e.key === "Enter" && !loading) {
      handleLogin(onClose);
    }
  };

  // Handle Enter key press for register
  const handleRegisterKeyPress = (e, onClose) => {
    if (e.key === "Enter" && !loading) {
      handleRegister(onClose);
    }
  };

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        Entrar
      </Button>

      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Bem-vindo
              </ModalHeader>

              <ModalBody>
                <Tabs
                  selectedKey={activeTab}
                  onSelectionChange={setActiveTab}
                  aria-label="Login ou Registar"
                  fullWidth
                >
                  <Tab key="login" title="Entrar">
                    <div className="flex flex-col gap-4 mt-4">
                      <Input
                        label="Nome de Utilizador ou Email"
                        placeholder="Insira o seu nome de utilizador ou email"
                        variant="bordered"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyPress={(e) => handleLoginKeyPress(e, onClose)}
                      />

                      <Input
                        label="Palavra-passe"
                        placeholder="Insira a sua palavra-passe"
                        type={isLoginPasswordVisible ? "text" : "password"}
                        variant="bordered"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => handleLoginKeyPress(e, onClose)}
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleLoginPasswordVisibility}
                          >
                            {isLoginPasswordVisible ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5 text-gray-400"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5 text-gray-400"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            )}
                          </button>
                        }
                      />
                    </div>
                  </Tab>

                  <Tab key="register" title="Registar">
                    <div className="flex flex-col gap-4 mt-4">
                      <Input
                        label="Nome"
                        placeholder="Insira o seu nome completo"
                        variant="bordered"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyPress={(e) => handleRegisterKeyPress(e, onClose)}
                        isRequired
                      />

                      <Input
                        label="Email"
                        placeholder="Insira o seu email"
                        type="email"
                        variant="bordered"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyPress={(e) => handleRegisterKeyPress(e, onClose)}
                        isRequired
                      />

                      <Input
                        label="Telefone"
                        placeholder="Insira o seu número de telefone"
                        type="tel"
                        variant="bordered"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onKeyPress={(e) => handleRegisterKeyPress(e, onClose)}
                        isRequired
                      />

                      <DatePicker
                        label="Data de Nascimento"
                        variant="bordered"
                        value={birthdate}
                        onChange={setBirthdate}
                        showMonthAndYearPickers
                        maxValue={today(getLocalTimeZone())}
                        description=""
                      />

                      <Input
                        label="Palavra-passe"
                        placeholder="Insira a sua palavra-passe"
                        type={isRegisterPasswordVisible ? "text" : "password"}
                        variant="bordered"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        onKeyPress={(e) => handleRegisterKeyPress(e, onClose)}
                        isRequired
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleRegisterPasswordVisibility}
                          >
                            {isRegisterPasswordVisible ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5 text-gray-400"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5 text-gray-400"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            )}
                          </button>
                        }
                      />

                      <Input
                        label="Confirmar Palavra-passe"
                        placeholder="Confirme a sua palavra-passe"
                        type={isConfirmPasswordVisible ? "text" : "password"}
                        variant="bordered"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyPress={(e) => handleRegisterKeyPress(e, onClose)}
                        isRequired
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                          >
                            {isConfirmPasswordVisible ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5 text-gray-400"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5 text-gray-400"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            )}
                          </button>
                        }
                      />
                    </div>
                  </Tab>
                </Tabs>
              </ModalBody>

              <ModalFooter>
                <Button color="" variant="flat" onPress={onClose}>
                  Fechar
                </Button>

                {activeTab === "login" ? (
                  <Button
                    color="primary"
                    isLoading={loading}
                    onPress={() => handleLogin(onClose)}
                  >
                    Entrar
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    isLoading={loading}
                    onPress={() => handleRegister(onClose)}
                  >
                    Registar
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoginModal;
