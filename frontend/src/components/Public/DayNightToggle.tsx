import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { gsap } from 'gsap';
import { RootState } from '@store/store';
import './DayNightToggle.css';

const DayNightToggle: React.FC = () => {
  const isDark = useSelector((state: RootState) => state.themeStore.isDark);

  useEffect(() => {
    const loadSVG = async (url: string) => {
      const response = await fetch(url);
      return await response.text();
    };

    const svgUrls = [
      'https://dl.dropboxusercontent.com/s/wppjkl1mapcofi1/egles_dark.svg?dl=0',
      'https://dl.dropboxusercontent.com/s/1tluv1o16bu8dv1/egles_light.svg?dl=0',
      'https://dl.dropboxusercontent.com/s/df61ibt6hk9mk2z/sun.svg',
      'https://dl.dropboxusercontent.com/s/z5nkite52l21gnn/moon.svg',
      'https://dl.dropboxusercontent.com/s/n329j6mekvr5mec/makonis_1.svg?dl=0',
      'https://dl.dropboxusercontent.com/s/jpd6t207d4s1ozo/makonis_2.svg?dl=0'
    ];

    Promise.all(svgUrls.map(loadSVG)).then(svgs => {
      document.querySelector('.forest-top')!.innerHTML = svgs[0];
      document.querySelector('.forest-bot')!.innerHTML = svgs[1];
      document.querySelector('.sun')!.innerHTML = svgs[2];
      document.querySelector('.moon')!.innerHTML = svgs[3];
      document.querySelectorAll('.cloud.top, .cloud.top-backup').forEach(el => el.innerHTML = svgs[4]);
      document.querySelectorAll('.cloud.mid, .cloud.mid-backup').forEach(el => el.innerHTML = svgs[5]);
      document.querySelectorAll('.cloud.bot, .cloud.bot-backup').forEach(el => el.innerHTML = svgs[4]);

      gsap.set('.moon', { bottom: '-200px', scale: 1.5 });
      gsap.set('.sun', { bottom: '-200px', scale: 1.5 });
      document.querySelectorAll('.cloud').forEach(tweenCloud);
    });
  }, []);

  useEffect(() => {
      daySwap();
  }, [isDark]);

  const tweenCloud = (cloud: Element) => {
    const offset = (cloud as HTMLElement).offsetLeft;
    const speed = (450 - offset) / 10;

    gsap.to(cloud, {
      duration: speed,
      left: '100vw',
      onComplete: () => {
        gsap.set(cloud, {
          left: '-5vw',
          onComplete: () => tweenCloud(cloud)
        });
      }
    });
  };

  const daySwap = () => {
    const bounceSize = 75;
    const visiblePosition = 70;

    gsap.to(isDark ? '.sun' : '.moon', {
      duration: 2,
      bottom: '-200px',
      ease: 'power4.out',
      delay: 0.2
    });

    gsap.to(isDark ? '.moon' : '.sun', {
      duration: 0.5,
      bottom: `${bounceSize}px`,
      scaleX: 1.5,
      scaleY: 1,
      ease: 'bounce.out',
      delay: 1
    });

    gsap.to(isDark ? '.moon' : '.sun', {
      duration: 2,
      bottom: `${visiblePosition}vh`,
      ease: 'bounce.out',
      scaleY: 1.5,
      scaleX: 1.5,
      delay: 1.2
    });
    
  };

  const generateStars = (n: number) => {
    let value = `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
    for (let i = 2; i <= n; i++) {
      value += `, ${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
    }
    return value;
  };

  useEffect(() => {
    const stars1 = document.querySelector('.stars') as HTMLElement;
    const stars2 = document.querySelector('.stars2') as HTMLElement;
    const stars3 = document.querySelector('.stars3') as HTMLElement;

    if (stars1) stars1.style.boxShadow = generateStars(100);
    if (stars2) stars2.style.boxShadow = generateStars(25);
    if (stars3) stars3.style.boxShadow = generateStars(10);
  }, []);

  return (
    <div className={`container ${isDark ? 'night' : 'day'}`}>
      <div className={`fixed inset-0 w-screen h-screen z-[1] ${isDark ? '' : 'opacity-0'} duration-500 transition-opacity`}>
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
    </div>
      <div className={`background ${isDark ? 'night' : 'day'}`}>
        <div className="overlay"></div>
        <div className="sun"></div>
        <div className="moon"></div>
        <div className="cloud top"></div>
        <div className="cloud top-backup"></div>
        <div className="cloud mid"></div>
        <div className="cloud mid-backup"></div>
        <div className="cloud bot"></div>
        <div className="cloud bot-backup"></div>
        <div className="forest-top"></div>
        <div className="forest-bot"></div>
      </div>
    </div>
  );
};

export default DayNightToggle;