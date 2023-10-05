import Layout from "../components/wrap"
import { AnimatedText } from "../hooks/useTextSlide"
// import { BsCurrencyDollar, BsShieldShaded, BsAlarm } from 'react-icons/bs';
import LinkTabs from "../components/LinkTabs";
import { WalletConnectButton } from "../components/ConnectWallet";
import React from "react";
import { Helmet } from "react-helmet";
// import Transition from "../hooks/useTransition";

const tabs = [
    {
        id: '1',
        title: 'Fixed Duration',
        content: (
            <div className="grid gap-2">
                <div className='text-lg font-bold'>
                    Stay disciplined with a dedicated savings timeline!
                </div>
                <div>
                    Each deposit you make is tied to a fixed duration. This means that once you make a deposit, the funds are locked up for a set period of time. This feature encourages savings discipline, as it prevents you from withdrawing your money prematurely. Instead, you commit to saving a certain amount for a certain period of time, allowing your savings to accumulate and grow. This is particularly beneficial for users who have long-term financial goals and need a structured saving program.
                </div>
            </div>
        ),
        image: (
            <svg viewBox="0 -25 380 480" xmlns="http://www.w3.org/2000/svg" transform="scale(-1 1)"><g fill="none" fillRule="evenodd"><path d="M144.262 65.49c-4.608-5.409-7.726-12.037-7.205-19.465 1.501-21.4 31.292-16.692 37.086-5.891 5.795 10.801 5.107 38.199-2.383 40.13-2.986.77-9.349-1.117-15.825-5.02L160 104h-24l8.262-38.51Z" fill="#73D2DE" /><path d="M142.418 70.308c-3.012-13.402-11.593-22.538-10.283-28.526.874-3.993 3.203-6.477 6.986-7.45 1.957-7.916 8.269-11.284 18.935-10.102 15.999 1.774 25.763 8.418 21.546 23.038-3.876 0-8.556-1.402-15.026 1-2.054.762-3.522 3.125-4.406 7.09h-2.924c-2.838-4.705-5.637-6.434-8.395-5.187-2.759 1.247-3.386 4.276-1.881 9.088l-1.44 11.049h-3.112Z" fill="#FFBC42" /></g><g fill="none" fillRule="evenodd"><path fill="#73D2DE" d="m134 187 49.082 124.227L216 416.25h13L178.674 187z" /><path d="M124.117 187c-.523 43.654-8.145 102.427-9.363 105.149-.812 1.814-28.838 24.883-84.078 69.209l8.953 9.58c65.179-38.003 99.276-59.539 102.292-64.607C146.445 298.728 161.174 228.763 173 187h-48.883Z" fill="#73D2DE" /><path d="M29.478 358.159c-3.006 1.063-5.078 2.07-6.214 3.024-1.381 1.158-3.204 3.08-5.468 5.764l36.255 43.206c4.653-1.991 6.114-4.32 4.38-6.988a312.366 312.366 0 0 1-4.257-6.702l-7.898-27.594a1 1 0 0 0-1.264-.678l-4.215 1.337c-2.923-1.363-4.973-2.744-6.148-4.144-.954-1.137-1.813-3.094-2.576-5.87a2 2 0 0 0-2.595-1.355Zm181.2 53.243c-1.118 2.986-1.678 5.221-1.678 6.704 0 1.803.3 4.434.901 7.894h56.402c1.466-4.845.62-7.461-2.538-7.848a312.366 312.366 0 0 1-7.87-1.046l-26.215-11.687a1 1 0 0 0-1.332.532l-1.685 4.088c-2.923 1.364-5.299 2.046-7.126 2.046-1.485 0-3.536-.6-6.153-1.8a2 2 0 0 0-2.706 1.117Z" fill="#E4E4E4" /><path fill="#69A1AC" d="m167 405.433 61.804-6.708L183 187h-55.356z" /><path d="M43.46 345.9 84 393.886c42.7-46.636 67.594-77.066 74.683-91.29 7.087-14.224 13.46-52.756 19.116-115.596h-62.32c-3.09 55.284-5.173 84.212-6.248 86.785-1.076 2.572-23 26.611-65.771 72.115Z" fill="#89C5CC" /></g><g fill="none" fillRule="evenodd"><path d="m213.456 84.34 37.904-11.377c7.071-5.504 13.74-9.529 20.009-12.073 1.823-.344 4.84-.144 1.07 4.134-3.772 4.278-7.547 8.948-6.47 10.742 1.077 1.794 5 .441 6.136 3.283.757 1.894-5.743 3.251-19.5 4.07l-29.471 17.345-9.678-16.122Zm-3.35 66.828 31.9 23.424c8.65 2.334 15.879 5.239 21.683 8.713 1.371 1.25 3.028 3.78-2.658 3.343-5.686-.438-11.687-.642-12.472 1.298-.785 1.94 2.657 4.259 1.07 6.876-1.057 1.744-6.052-2.63-14.986-13.124l-31.588-13.099 7.052-17.43Z" fill="#73D2DE" /><path d="M160.56 88.087c17.372 32.39 42.49 57.219 78.906 83.03l-13.789 15.546c-40.66-15.11-62.118-24.227-72.656-54.828-2.645-7.68-4.493-32.164-6.078-45.046l13.618 1.298Z" fill="#2026A2" /><path d="M112 196h77c-17.442-53.195-26.352-89.704-26.73-109.528-.02-1.011-1.886-2.792-2.711-2.559-6.04 1.706-12.502 1.068-19.387-1.913-18.255 29.358-24.567 65.505-28.172 114Z" fill="#F2F2F2" /><path d="M146.743 82.047c22.071.181 57.881 4.213 99.18-9.047L250 93.373c-31.213 20.075-62.82 35.627-90.514 33.418 12.026 51.586 11.472 93.815-15.079 93.815h-41.056c-6.52-43.822 10.617-104.582 26.505-135.23.607-1.17 1.898-3.376 4.941-3.376h11.93l.016.047Z" fill="#1F28CF" /></g></svg>
        ),
    },
    {
        id: '2',
        title: 'Weekly Amounts',
        content: (
            <div className="grid gap-2">
                <div className='text-lg font-bold'>
                    Customize your deposits to fit your personal budget!
                </div>
                <div>
                    We understand that everyone's financial situation is unique, which is why Coffer City provides flexibility in the amount you wish to save weekly. This means you can tailor your deposits to suit your personal budget. Whether you want to save a small amount each week, or you have the capacity to set aside a larger sum, you have the freedom to adjust your savings plan based on your financial situation and goals.
                </div>
            </div>
        ),
        image: (
            <svg viewBox="0 -25 380 480" xmlns="http://www.w3.org/2000/svg" transform="scale(-1 1)"><g fill="none" fillRule="evenodd"><path d="M143 77.707c11.429 0 15.585-13.683 22.079-21.192 4.645-5.372 12.574-3.77 14.921-11.291C185.902 26.31 170.106 13 149.5 13S115 24.674 112 42.224s10.394 35.483 31 35.483Z" fill="#8F2D56" /><path d="M144.262 65.49c-4.608-5.409-7.726-12.037-7.205-19.465 1.501-21.4 31.292-16.692 37.086-5.891 5.795 10.801 5.107 38.199-2.383 40.13-2.986.77-9.349-1.117-15.825-5.02L160 104h-24l8.262-38.51Z" fill="#000" /><path d="M154.38 51.723a6.256 6.256 0 0 0-2.933-.723c-3.4 0-6.157 2.686-6.157 6 0 1.352.46 2.6 1.234 3.604-1.459 2.404-2.454 4.93-2.78 7.528-5.057 0-23.51-19.132-5.127-37.132 18.383-18 44.949 7.696 36.966 9.195-4.59.861-13.833 5.243-21.203 11.528Z" fill="#8F2D56" /></g><g fill="none" fillRule="evenodd"><path fill="#000" d="m134 187 49.082 124.227L216 416.25h13L178.674 187z" /><path d="M124.117 187c-.523 43.654-8.145 102.427-9.363 105.149-.812 1.814-28.838 24.883-84.078 69.209l8.953 9.58c65.179-38.003 99.276-59.539 102.292-64.607C146.445 298.728 161.174 228.763 173 187h-48.883Z" fill="#000" /><path d="M29.478 358.159c-3.006 1.063-5.078 2.07-6.214 3.024-1.381 1.158-3.204 3.08-5.468 5.764l36.255 43.206c4.653-1.991 6.114-4.32 4.38-6.988a312.366 312.366 0 0 1-4.257-6.702l-7.898-27.594a1 1 0 0 0-1.264-.678l-4.215 1.337c-2.923-1.363-4.973-2.744-6.148-4.144-.954-1.137-1.813-3.094-2.576-5.87a2 2 0 0 0-2.595-1.355Zm181.2 53.243c-1.118 2.986-1.678 5.221-1.678 6.704 0 1.803.3 4.434.901 7.894h56.402c1.466-4.845.62-7.461-2.538-7.848a312.366 312.366 0 0 1-7.87-1.046l-26.215-11.687a1 1 0 0 0-1.332.532l-1.685 4.088c-2.923 1.364-5.299 2.046-7.126 2.046-1.485 0-3.536-.6-6.153-1.8a2 2 0 0 0-2.706 1.117Z" fill="#E4E4E4" /><path fill="#69A1AC" d="m167 405.433 61.804-6.708L183 187h-55.356z" /><path d="M43.46 345.9 84 393.886c42.7-46.636 67.594-77.066 74.683-91.29 7.087-14.224 13.46-52.756 19.116-115.596h-62.32c-3.09 55.284-5.173 84.212-6.248 86.785-1.076 2.572-23 26.611-65.771 72.115Z" fill="#89C5CC" /></g><g fill="none" fillRule="evenodd"><path d="m216.044 171.123 28.328 27.635c8.243 3.515 14.996 7.398 20.26 11.646 1.185 1.428 2.473 4.164-3.097 2.94-5.57-1.225-11.484-2.262-12.531-.45-1.047 1.811 2.038 4.587.103 6.958-1.29 1.58-5.628-3.447-13.014-15.082l-29.457-17.368 9.408-16.28ZM90.308 175.02l20.897.082c-12.903 41.654-19.869 63.755-20.897 66.304-2.314 5.734 2.583 14.468 4.677 19.161-6.82 3.052-6.094-8.25-14.697-4.248-7.853 3.654-13.826 10.273-22.899 4.675-1.115-.688-2.338-3.28.616-5.304 7.357-5.045 17.96-13.875 19.393-16.782 1.954-3.963 6.257-25.26 12.91-63.888Z" fill="#000" /><path d="m149.695 87.332 8.647-1.483c14.887 37.19 40.88 70.983 77.976 101.376l-28.031 34.056c-37.093-43.277-59.957-87.925-58.592-133.949Z" fill="#191847" /><path d="M112 196h77c-17.84-43.375-26.759-80.221-26.759-110.54L139.014 82c-18.254 29.358-23.41 65.505-27.014 114Z" fill="#DDE3E9" /><path d="m138.522 82.016.01-.016h1.516c1.814.062 4.577.175 8.29.338l5.612 16.039c.594 19.555 4.06 58.965 10.401 118.229h-50.475a304.4 304.4 0 0 0 .655 12.394H77c5.614-63.336 26.115-112.336 61.504-147l.018.016Z" fill="#2F3676" /><path d="M117.21 164.233c1.437 25.515 5.033 43.104 10.79 52.767h-14.11c-.619-18.357.488-35.946 3.32-52.767Z" fillOpacity=".1" fill="#000" /><path fillOpacity=".2" fill="#FFF" d="M125.11 186 150 174.43V186z" /></g></svg>
        ),
    },
    {
        id: '3',
        title: 'Top-Up Opportunity',
        content: (
            <div className="grid gap-2">
                <div className='text-lg font-bold'>
                    Maximize your savings with weekly top-ups!
                </div>
                <div>
                    Coffer City offers the feature to top-up your deposits every week. It's an excellent way to save more when you have spare cash. This feature encourages active saving and helps you to save faster towards your financial goals.
                </div>
            </div>
        ),
        image: (
            <svg viewBox="0 -25 380 480" xmlns="http://www.w3.org/2000/svg" transform="scale(-1 1)"><g fill="none" fillRule="evenodd"><path d="M144.262 65.49c-4.608-5.409-7.726-12.037-7.205-19.465 1.501-21.4 31.292-16.692 37.086-5.891 5.795 10.801 5.107 38.199-2.383 40.13-2.986.77-9.349-1.117-15.825-5.02L160 104h-24l8.262-38.51Z" fill="#8F2D56" /><path d="M157.135 48.389c.919 12.797 3.35 19.196 7.29 19.196 5.914 0 10.93-3.754 13.525-3.754 1.89 0 1.469 2.367.215 4.121-1.034 1.448-6.071 2.844-6.071 5.088 0 2.245 3.98.508 3.98 1.84 0 2.201.699 6.341-3.123 6.341-3.867 0-14.956-1.41-16.857-7.15-1.226-3.704-2.019-11.38-2.378-23.029a6 6 0 0 0-4.908 10.25 90.97 90.97 0 0 1-4.728 6.12c-6.698-4.02-11.668-15.783-5.12-27.084 1.81-5.536 5.908-8.493 10.747-9.866 3.92-1.64 7.99-1.824 11.425-.841 6.734.577 12.747 2.63 14.451 3.85 0 6.375-1.235 8.267-11.786 8.1-2.593 1.37-4.586 3.727-6.662 6.818Z" fill="#218380" /></g><g fill="none" fillRule="evenodd"><path fill="#8F2D56" d="m134 187 49.082 124.227L216 416.25h13L178.674 187z" /><path d="M124.117 187c-.523 43.654-8.145 102.427-9.363 105.149-.812 1.814-28.838 24.883-84.078 69.209l8.953 9.58c65.179-38.003 99.276-59.539 102.292-64.607C146.445 298.728 161.174 228.763 173 187h-48.883Z" fill="#8F2D56" /><path d="M29.478 358.159c-3.006 1.063-5.078 2.07-6.214 3.024-1.381 1.158-3.204 3.08-5.468 5.764l36.255 43.206c4.653-1.991 6.114-4.32 4.38-6.988a312.366 312.366 0 0 1-4.257-6.702l-7.898-27.594a1 1 0 0 0-1.264-.678l-4.215 1.337c-2.923-1.363-4.973-2.744-6.148-4.144-.954-1.137-1.813-3.094-2.576-5.87a2 2 0 0 0-2.595-1.355Zm181.2 53.243c-1.118 2.986-1.678 5.221-1.678 6.704 0 1.803.3 4.434.901 7.894h56.402c1.466-4.845.62-7.461-2.538-7.848a312.366 312.366 0 0 1-7.87-1.046l-26.215-11.687a1 1 0 0 0-1.332.532l-1.685 4.088c-2.923 1.364-5.299 2.046-7.126 2.046-1.485 0-3.536-.6-6.153-1.8a2 2 0 0 0-2.706 1.117Z" fill="#E4E4E4" /><path fill="#69A1AC" d="m167 405.433 61.804-6.708L183 187h-55.356z" /><path d="M43.46 345.9 84 393.886c42.7-46.636 67.594-77.066 74.683-91.29 7.087-14.224 13.46-52.756 19.116-115.596h-62.32c-3.09 55.284-5.173 84.212-6.248 86.785-1.076 2.572-23 26.611-65.771 72.115Z" fill="#89C5CC" /></g><g fill="none" fillRule="evenodd"><path d="m220 159.617 36.235-15.913c6.347-6.325 12.476-11.132 18.388-14.422 1.767-.563 4.787-.733 1.565 3.973-3.222 4.706-6.4 9.801-5.112 11.45 1.288 1.65 5.017-.17 6.49 2.511.983 1.788-5.304 3.927-18.859 6.417l-27.137 20.806L220 159.617ZM73.508 164 94 168.066c-20.608 38.405-31.66 58.76-33.155 61.064-3.365 5.185-.225 14.687.934 19.691-7.275 1.694-4.406-9.256-13.612-6.97-8.403 2.087-15.528 7.442-23.363.22-.963-.888-1.669-3.664 1.616-5.087 8.183-3.547 20.272-10.188 22.232-12.766 2.674-3.516 10.959-23.588 24.856-60.218Z" fill="#8F2D56" /><path d="m149.695 87.332 8.647-1.483c18.834 18.27 26.52 62.164 39.072 67.974 11.867 5.493 28.69.177 48.686-7l6.124 13.681c-18.169 19.657-56.873 36.263-72.564 26.783-25.084-15.157-30.874-69.295-29.965-99.955Z" fill="#DB2721" /><path d="M112 196h76.511c3.497 0 2.838-5.048 2.332-7.596-5.832-29.4-28.602-61.092-28.602-102.943L140.171 82c-18.253 29.358-24.565 65.505-28.171 114Z" fill="#DDE3E9" /><path d="M104.369 166.233C88.77 194.368 75.66 214.623 65.037 227L49 223.859C59.33 159.79 89.247 112.504 138.748 82h8.738c19.813 67.537 25.275 112.537 16.386 135H95c1.09-16.437 4.583-33.819 9.369-50.767Z" fill="#FF4133" /></g></svg>
        ),
    },
    {
        id: '4',
        title: 'Unique IDs',
        content: (
            <div className="grid gap-2">
                <div className='text-lg font-bold'>
                    Access your deposits anytime, anywhere!
                </div>
                <div>
                    Every deposit you make is associated with a unique ID. This ID allows you to track and manage your deposits independently of each other. You can check the status, balance and duration of each of your deposits at any time. It provides flexibility, transparency, and control over your savings, ensuring that you always have access to your funds' details, regardless of where you are.
                </div>
            </div>
        ),
        image: (
            <svg viewBox="0 -25 380 480" xmlns="http://www.w3.org/2000/svg" transform="scale(-1 1)"><path d="M144.262 65.49c-4.608-5.409-7.726-12.037-7.205-19.465 1.501-21.4 31.292-16.692 37.086-5.891 5.795 10.801 5.107 38.199-2.383 40.13-2.986.77-9.349-1.117-15.825-5.02L160 104h-24l8.262-38.51Z" fillRule="evenodd" /><g fill="none" fillRule="evenodd"><path fill="#000" d="m134 187 49.082 124.227L216 416.25h13L178.674 187z" /><path d="M124.117 187c-.523 43.654-8.145 102.427-9.363 105.149-.812 1.814-28.838 24.883-84.078 69.209l8.953 9.58c65.179-38.003 99.276-59.539 102.292-64.607C146.445 298.728 161.174 228.763 173 187h-48.883Z" fill="#000" /><path d="M29.478 358.159c-3.006 1.063-5.078 2.07-6.214 3.024-1.381 1.158-3.204 3.08-5.468 5.764l36.255 43.206c4.653-1.991 6.114-4.32 4.38-6.988a312.366 312.366 0 0 1-4.257-6.702l-7.898-27.594a1 1 0 0 0-1.264-.678l-4.215 1.337c-2.923-1.363-4.973-2.744-6.148-4.144-.954-1.137-1.813-3.094-2.576-5.87a2 2 0 0 0-2.595-1.355Zm181.2 53.243c-1.118 2.986-1.678 5.221-1.678 6.704 0 1.803.3 4.434.901 7.894h56.402c1.466-4.845.62-7.461-2.538-7.848a312.366 312.366 0 0 1-7.87-1.046l-26.215-11.687a1 1 0 0 0-1.332.532l-1.685 4.088c-2.923 1.364-5.299 2.046-7.126 2.046-1.485 0-3.536-.6-6.153-1.8a2 2 0 0 0-2.706 1.117Z" fill="#E4E4E4" /><path fill="#69A1AC" d="m167 405.433 61.804-6.708L183 187h-55.356z" /><path d="M43.46 345.9 84 393.886c42.7-46.636 67.594-77.066 74.683-91.29 7.087-14.224 13.46-52.756 19.116-115.596h-62.32c-3.09 55.284-5.173 84.212-6.248 86.785-1.076 2.572-23 26.611-65.771 72.115Z" fill="#89C5CC" /></g><g fill="none" fillRule="evenodd"><path d="m180.638 124.7 34.71-19.01c5.772-6.854 11.459-12.178 17.061-15.97 1.712-.715 4.705-1.147 1.906 3.822-2.8 4.968-5.52 10.32-4.095 11.852 1.427 1.53 4.983-.608 6.685 1.935 1.134 1.696-4.942 4.375-18.228 8.036l-25.221 23.093-12.818-13.758ZM235 140.74l15.247-8.376c2.139-8.14 4.696-12.236 7.671-12.287 2.286-1.063-1.694 9.223 2.638 8.33 4.333-.891 14.908-8.756 16.73-7.16 2.696 2.363.292 9.617-2.54 13.226-5.293 6.745-9.675 9.051-20.508 12.071-5.663 1.58-11.787 4.745-18.37 9.496l-.868-15.3Z" fill="#000" /><path d="M163.734 120.465c12.158-.128 28.37-2.696 45.669-13.677l6.793 15.15c-11.932 11.843-28.71 21.572-43.38 21.16-11.56-.326-17.469-14.308-9.082-22.633Z" fill="#2026A2" /><path d="M180.104 144.761c12.907 3.22 34.55-.577 64.932-11.388 7.536 15.59 11.02 26.705 10.45 33.344-26.062 13.614-48.4 19.684-66.803 20.085.585 10.92-.744 21.31-5.21 30.804-9.178 19.518-62.928 1.442-81 5-11.318-36.755 10.565-51.692 10.583-75.21C113.075 121.643 133.754 82 136.797 82h27.747c1.53 19.669 9.236 41.346 15.56 62.761Z" fill="#1F28CF" /></g></svg>
        ),
    },
];

const Root = () => {

    // const context = React.useContext(AppContext);
    // const { state } = context || {};

    // console.log(state.upline)

    return (
        <React.Fragment>
            <Helmet>
                <title>Coffer City | Saving Made Simple, Smart, and Secure</title>

                {/* <!-- Meta --> */}
                <meta charSet="utf-8" />

                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                
                {/* <!-- The above 3 meta tags must come first in the head; any other head content must come after these tags --> */}
                <meta name="description" content="Crypto Saving Made Simple, Smart, and Secure. Powered by decentralized blockchain technology. Start saving your crypto today!" />

                <meta name="keywords" content="blockchain, dApp, decentralized applications, DeFi, decentralized finance, NFT, non-fungible tokens, cryptocurrency, crypto, Bitcoin, Binance Smart Chain, how to save money in cryptocurrency, save with crypto, how to save crypto in wallet, where can I save my bitcoin, how to save money in bitcoin, save in dollars, how to save cryptocurrency, save with crypto, save in dollars in nigeria, save in bitcoin, safe haven crypto, how to save cryptocurrency, how to save crypto, Save crypto to usd, Saving in dollars in Nigeria, How to save in US dollar in nigeria" />

                <meta property="og:site_name" content="Crypto Saving Made Simple, Smart, and Secure." />

                <meta property="og:title" content="Crypto Saving Made Simple, Smart, and Secure. " />

                <meta property="og:type" content="website" />

                <meta property="og:description" content="Crypto Saving Made Simple, Smart, and Secure. Powered by decentralized blockchain technology. Start saving your crypto today!" />

                <meta property="og:image" content="https://coffer.city/images/share.jpg" />

                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:image:width" content="512" />
                <meta property="og:image:height" content="315" />
                <meta property="og:url" content="https://coffer.city" />
                <meta property="twitter:card" content="summary_large_image" />

                <meta name="title" content="&quot;Coffer City offers the feature to top-up your deposits every week. It's an excellent way to save more when you have spare cash.&quot;" />

                <link rel="canonical" href="https://coffer.city" />

                <link rel="icon" type="image/png" href="images/favicon.png" />
                <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
            </Helmet>
            <Layout navbar footer>
                <div>
                    <div className='grid gap-16'>

                        {/* <Transition direction="top" tension={30} friction={28}>
                        <h3 className="font-monoton text-5xl md:text-[120px] text-center">Coffer</h3>
                        <h1 className="font-monoton text-9xl md:text-[250px] text-center">City</h1>
                    </Transition> */}

                        <div className="bg-[#02075d] text-slate-50 px-8 md:px-32 py-[50%] md:py-[13%] h-[120%] md:h-[130%]">
                            <div className='py-8'>Welcome to</div>
                            <div className="text-5xl md:text-6xl font-monoton w-full md:w-2/3">
                                Coffer City, the
                                <span className="md:flex gap-3 flex-wrap ml-4 md:m-0">
                                    digital
                                    <AnimatedText
                                        className='py-1'
                                        items={["Bank", "Chest", "Vault", "Reserve", "Treasury", "Safe"]}
                                        interval={8000}
                                        direction="top"
                                    />
                                </span>
                                <span className="flex gap-3 flex-wrap">
                                    that helps you
                                    <AnimatedText
                                        // className='underline underline-offset-8'
                                        items={["Invest", "Save", "Evolve", "Grow"]}
                                        interval={2000}
                                        direction="top"
                                    />
                                </span>
                                on your terms!
                            </div>
                        </div>

                        <div className="px-10 md:px-32 py-5 grid gap-8 grid-cols-1 md:grid-cols-3">

                            <div className="rounded-xl bg-slate-300/30 backdrop-blur-sm p-5 grid gap-5">
                                <div className="h-52 bg-white flex rounded-xl">
                                    <div className="m-auto text-center">
                                        {/* <BsCurrencyDollar size={60} /> */}
                                        <span className="text-[60px]">💰</span>
                                    </div>
                                </div>
                                <div className=''>
                                    <div className="font-monoton text-lg">Weekly Deposits</div>
                                    <div className="text-sm">Set your weekly goal</div>
                                </div>
                            </div>

                            <div className="rounded-xl bg-slate-300/30 backdrop-blur-sm p-5 grid gap-5">
                                <div className="h-52 bg-white flex rounded-xl">
                                    <div className="m-auto text-center">
                                        {/* <BsAlarm size={60} /> */}
                                        <span className="text-[60px]">⏰</span>
                                    </div>
                                </div>
                                <div className=''>
                                    <div className="font-monoton text-lg">Fixed Duration</div>
                                    <div className="text-sm">Choose your deposit period</div>
                                </div>
                            </div>

                            <div className="rounded-xl bg-slate-300/30 backdrop-blur-sm p-5 grid gap-5">
                                <div className="h-52 bg-white flex rounded-xl">
                                    <div className="m-auto text-center">
                                        {/* <BsShieldShaded size={60} /> */}
                                        <span className="text-[60px]">🛡️</span>
                                    </div>
                                </div>
                                <div className=''>
                                    <div className="font-monoton text-lg">Unique ID</div>
                                    <div className="text-sm">Easily track your savings</div>
                                </div>
                            </div>

                        </div>

                        <div className="text-center m-auto px-10 md:px-32 max-w-3xl justify-between">
                            <div className="grid gap-5">

                                <div className="font-monoton text-5xl">Get Started</div>

                                <div className="text-sm">Kickstart your savings journey with Coffer City! Don’t miss out on a secure, straightforward, and rewarding experience.</div>

                                <div className="text-sm mx-auto">
                                    <WalletConnectButton />
                                </div>

                            </div>
                        </div>

                        <div className="grid gap-12 px-10 md:px-32">

                            <div className="font-monoton text-5xl">Key Features</div>

                            <LinkTabs contentClassName="" tabs={tabs} />

                        </div>

                        <div className="grid gap-12 px-10 md:px-32 bg-[#02075d] text-slate-50 py-10">

                            <div className="font-monoton text-5xl">FAQs</div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                                <div className="text-sm grid gap-5">
                                    <div className="text-lg text-slate-400 font-semibold">How does Coffer City work?</div>
                                    <p>Coffer City allows you to deposit a specified weekly amount for a fixed duration, encouraging consistent saving habits. You can top-up your deposits once a week before the duration ends.</p>
                                </div>

                                <div className="text-sm grid gap-3">
                                    <div className="text-lg text-slate-400 font-semibold">What if I miss a deposit?</div>
                                    <p>Fret not! If you miss a deposit, a debt accumulates corresponding to the amount you should have deposited. Coffer City helps keep you accountable!</p>
                                </div>

                                <div className="text-sm grid gap-3">
                                    <div className="text-lg text-slate-400 font-semibold">Can I track my savings?</div>
                                    <p>Absolutely! Each deposit comes with a unique ID that you can use to track your savings and monitor your progress anytime, anywhere.</p>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </Layout>
        </React.Fragment>
    )
}

export default Root
