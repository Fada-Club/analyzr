import { LucideProps } from "lucide-react"

export const Icons = {
  discord: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 127.14 96.36"
      {...props}
    >
      <path
        fill="currentColor"
        d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
      />
    </svg>
  ),
  verificationBadge: (props: LucideProps) => {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={props.className}
      >
        <path
          d="M17.7508 9.41667C17.7508 8.1 17.0217 6.95833 15.9608 6.41667C16.0892 6.05417 16.1592 5.6625 16.1592 5.25C16.1592 3.40833 14.7342 1.91833 12.9775 1.91833C12.5858 1.91833 12.2108 1.98833 11.8642 2.12667C11.3492 1.0125 10.2592 0.25 9.00083 0.25C7.7425 0.25 6.65417 1.01417 6.13667 2.125C5.79083 1.9875 5.415 1.91667 5.02333 1.91667C3.265 1.91667 1.84167 3.40833 1.84167 5.25C1.84167 5.66167 1.91083 6.05333 2.03917 6.41667C0.979167 6.95833 0.25 8.09833 0.25 9.41667C0.25 10.6625 0.901667 11.7483 1.86833 12.3217C1.85167 12.4633 1.84167 12.605 1.84167 12.75C1.84167 14.5917 3.265 16.0833 5.02333 16.0833C5.415 16.0833 5.79 16.0117 6.13583 15.875C6.6525 16.9867 7.74083 17.75 9 17.75C10.26 17.75 11.3483 16.9867 11.8642 15.875C12.21 16.0108 12.585 16.0817 12.9775 16.0817C14.7358 16.0817 16.1592 14.59 16.1592 12.7483C16.1592 12.6033 16.1492 12.4617 16.1317 12.3208C17.0967 11.7483 17.7508 10.6625 17.7508 9.4175V9.41667ZM12.2375 6.63833L8.62583 12.055C8.505 12.2358 8.3075 12.3333 8.105 12.3333C7.98583 12.3333 7.865 12.3 7.75833 12.2283L7.6625 12.15L5.65 10.1375C5.40583 9.89333 5.40583 9.4975 5.65 9.25417C5.89417 9.01083 6.29 9.00917 6.53333 9.25417L8.00833 10.7267L11.1958 5.94333C11.3875 5.65583 11.7758 5.58 12.0625 5.77083C12.3508 5.9625 12.4292 6.35083 12.2375 6.6375V6.63833Z"
          fill="#1D9BF0"
        />
      </svg>
    )
  },
}

export const IconGithub = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
};