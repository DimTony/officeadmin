/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// import React, { useState, createContext, useContext } from "react";
// import { ChevronDown } from "lucide-react";

// const AccordionContext = createContext();

// const useAccordion = () => {
//   const context = useContext(AccordionContext);
//   if (!context) {
//     throw new Error(
//       "Accordion components must be used within an AccordionRoot"
//     );
//   }
//   return context;
// };

// const AccordionRoot = ({ children, allowMultiple = false, className = "" }) => {
//   const [openItems, setOpenItems] = useState(new Set());

//   const toggleItem = (itemKey) => {
//     setOpenItems((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(itemKey)) {
//         newSet.delete(itemKey);
//       } else {
//         if (!allowMultiple) {
//           newSet.clear();
//         }
//         newSet.add(itemKey);
//       }
//       return newSet;
//     });
//   };

//   return (
//     <AccordionContext.Provider value={{ openItems, toggleItem }}>
//       <div className={`w-full space-y-2 ${className}`}>{children}</div>
//     </AccordionContext.Provider>
//   );
// };

// const AccordionItem = ({ children, itemKey, className = "" }) => {
//   const { openItems, toggleItem } = useAccordion();
//   const isOpen = openItems.has(itemKey);

//   return (
//     <div className={`border rounded-lg overflow-hidden ${className}`}>
//       {React.Children.map(children, (child) => {
//         if (React.isValidElement(child)) {
//           return React.cloneElement(child, {
//             isOpen,
//             onToggle: () => toggleItem(itemKey),
//           });
//         }
//         return child;
//       })}
//     </div>
//   );
// };

// const AccordionTrigger = ({ children, isOpen, onToggle, className = "" }) => {
//   return (
//     <button
//       className={`w-full p-4 flex justify-between items-center bg-white hover:bg-gray-50 ${className}`}
//       onClick={onToggle}
//       type="button"
//       aria-expanded={isOpen}
//     >
//       <span className="text-left">{children}</span>
//       <ChevronDown
//         className={`transform transition-transform duration-200 ${
//           isOpen ? "rotate-180" : ""
//         }`}
//       />
//     </button>
//   );
// };

// const AccordionContent = ({ children, isOpen, className = "" }) => {
//   if (!isOpen) return null;

//   return <div className={`p-4 bg-white border-t ${className}`}>{children}</div>;
// };

// export { AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent };

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const AccordionRoot = ({ children, allowMultiple = false }) => {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (itemKey) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemKey)) {
        newSet.delete(itemKey);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(itemKey);
      }
      return newSet;
    });
  };

  const contextValue = {
    openItems,
    toggleItem,
  };

  return (
    <div className="w-full space-y-2">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isOpen: openItems.has(child.key),
            onToggle: () => toggleItem(child.key),
          });
        }
        return child;
      })}
    </div>
  );
};

const AccordionItem = ({ children, isOpen, onToggle }) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isOpen, onToggle });
        }
        return child;
      })}
    </div>
  );
};

const AccordionItemTrigger = ({ children, isOpen, onToggle }) => {
  return (
    <button
      className="w-full p-4 flex justify-between items-center bg-white hover:bg-gray-50"
      onClick={onToggle}
    >
      {children}
      <ChevronDown
        className={`transform transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  );
};

const AccordionItemContent = ({ children, isOpen }) => {
  if (!isOpen) return null;

  return <div className="p-4 bg-white border-t">{children}</div>;
};

export {
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
};
