'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './style.module.scss';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import Nav from './nav';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Rounded from '../../common/RoundedButton';
import Magnetic from '../../common/Magnetic';

export default function Header() {
    const header = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const pathname = usePathname();
    const button = useRef(null);

    // ✅ يتم إلغاء تفعيل القائمة عند تغيير المسار
    useEffect(() => {
        if (isActive) {
            setIsActive(false);
        }
    }, [pathname, isActive]); // ✅ أضفنا isActive كمُعتمد

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            gsap.to(button.current, {
                scrollTrigger: {
                    trigger: document.documentElement,
                    start: 0,
                    end: window.innerHeight,
                    onLeave: () => {
                        gsap.to(button.current, {
                            scale: 1,
                            duration: 0.25,
                            ease: "power1.out"
                        });
                    },
                    onEnterBack: () => {
                        gsap.to(button.current, {
                            scale: 0,
                            duration: 0.25,
                            ease: "power1.out"
                        });
                        setIsActive(false);
                    }
                }
            });
        }, button); // ✅ نستخدم context لسهولة التنظيف

        return () => ctx.revert(); // ✅ تنظيف ScrollTrigger عند الخروج
    }, []); // ✅ لا حاجة لإضافة isActive هنا لأن setIsActive لا تعتمد على القيم السابقة

    return (
        <>
            <div ref={header} className={styles.header}>
                <div className={styles.logo}>
                    <p className={styles.copyright}>©</p>
                    <div className={styles.name}>
                        <p className={styles.codeBy}>Code by</p>
                        <p className={styles.dennis}>mohamed</p>
                        <p className={styles.snellenberg}>AGUIAGOU</p>
                    </div>
                </div>
                <div className={styles.nav}>
                    {['Work', 'About', 'Contact'].map((item) => (
                        <Magnetic key={item}>
                            <div className={styles.el}>
                                <a>{item}</a>
                                <div className={styles.indicator}></div>
                            </div>
                        </Magnetic>
                    ))}
                </div>
            </div>

            <div ref={button} className={styles.headerButtonContainer}>
                <Rounded onClick={() => setIsActive(!isActive)} className={styles.button}>
                    <div className={`${styles.burger} ${isActive ? styles.burgerActive : ""}`}></div>
                </Rounded>
            </div>

            <AnimatePresence mode="wait">
                {isActive && <Nav />}
            </AnimatePresence>
        </>
    );
}
