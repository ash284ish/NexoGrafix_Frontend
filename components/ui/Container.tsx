import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
};

export default function Container({ children }: ContainerProps) {
  return (
    <div
      style={{
        maxWidth: "1300px",
        margin: "0 auto",
        padding: "0 20px"
      }}
    >
      {children}
    </div>
  );
}
