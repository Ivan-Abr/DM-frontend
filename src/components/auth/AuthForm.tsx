import React from 'react';
import styles from '../../auth.module.css';

interface AuthFormProps {
    title: string;
    submitText: string;
    children: React.ReactNode;
    footerText: string;
    footerLinkText: string;
    footerLinkPath: string;
    showLogo?: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
                                               title,
                                               submitText,
                                               children,
                                               footerText,
                                               footerLinkText,
                                               footerLinkPath,
                                               showLogo = false,
                                               onSubmit,
                                           }) => {
    return (
        <div className={styles.container}>
            {showLogo && <img src="/images/logo.png" alt="Логотип" className={styles.logo} />}
            <h2>{title}</h2>
            <form onSubmit={onSubmit}>
                {children}
                <button type="submit" className={styles.button}>
                    {submitText}
                </button>
            </form>
            <p className={styles.footer}>
                {footerText} <a href={footerLinkPath} className={styles.link}>{footerLinkText}</a>
            </p>
        </div>
    );
};

export default AuthForm;