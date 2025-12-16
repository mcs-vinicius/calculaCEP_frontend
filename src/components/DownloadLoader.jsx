// src/components/DownloadLoader.jsx
import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from '@gsap/react';
import './DownloadLoader.css';

gsap.registerPlugin(useGSAP, DrawSVGPlugin);

const DownloadLoader = ({ onComplete }) => {
  const container = useRef();

  useGSAP(() => {
    // --- Seleção de Elementos ---
    const $status = container.current.querySelector('.dl-status');
    const $statusNumbers = container.current.querySelector('.dl-status__numbers');
    const $dlSVG = container.current.querySelector('.dl-svg');
    const $circle = container.current.querySelector('.dl-svg__circle');
    const $arrMain = container.current.querySelector('.dl-svg__arrow-main');
    const $arrSides = container.current.querySelectorAll('.dl-svg__arrow-side');
    const $rotater = container.current.querySelector('.dl-svg__rotater');
    const $tri = container.current.querySelector('.dl-svg__triangle');
    const $triPiece = container.current.querySelector('.dl-svg__triangle-piece');
    const $plc = container.current.querySelector('.dl-svg__progress-plc');
    const $progress = container.current.querySelector('.dl-svg__progress');
    const $prVert = container.current.querySelector('.dl-svg__progress-vert');
    const $check = container.current.querySelector('.dl-svg__checkmark');
    const $particlesStage2 = container.current.querySelector('.particles.m--stage-2');
    const $particlesStage3 = container.current.querySelector('.particles.m--stage-3');

    // --- Constantes de Tempo ---
    const arrInitAT = 0.6, dotFadeAT = 0.1, rtRotationAT = 1.4, triAT = 1.1;
    const rtDelay = arrInitAT + dotFadeAT, triPhase2Delay = triAT * 0.8;
    const progressDelay = 0.1, progressAT = 1, prCollapseAT = 0.5, prMoveAT = 0.5;
    const circleAT = 0.7, checkAT = 0.7;

    // Define o estado inicial dos elementos
    gsap.set([$arrMain, $arrSides], { drawSVG: "100%" });
    gsap.set($circle, { transformOrigin: '50% 50%' });
    gsap.set($rotater, { opacity: 0, transformOrigin: '50% 50%', drawSVG: '0.5px', rotation: 0 });
    gsap.set([$tri, $triPiece, $plc, $progress, $prVert, $check], { opacity: 0, drawSVG: 0 });
    gsap.set($prVert, { transformOrigin: '50% 77px' });

    // --- Funções de Animação ---

    const checkmarkAnim = () => {
      gsap.set($check, { opacity: 1 });
      gsap.set($prVert, { opacity: 0 });
      gsap.to($check, { duration: checkAT * 0.7, drawSVG: '100% 40%' });
      gsap.to($check, {
        duration: checkAT * 0.3, drawSVG: '95% 35%', delay: checkAT * 0.7,
        onComplete: () => setTimeout(onComplete, 500)
      });
    };

    const successAnim = () => {
      $statusNumbers.innerHTML = "100";
      gsap.set($circle, { opacity: 1, drawSVG: 0, scale: 1 });
      gsap.to($circle, { duration: circleAT, drawSVG: '100%' }); 
      gsap.to($prVert, { duration: circleAT, rotation: -432, onComplete: checkmarkAnim });
    };

    const afterProgressAnim = () => {
      $status.classList.remove('s--active');
      gsap.set($plc, { opacity: 0 });
      gsap.to($progress, { duration: prCollapseAT, drawSVG: '157px 156px' });
      gsap.set($progress, { opacity: 0, delay: prCollapseAT });
      gsap.set($prVert, { opacity: 1, delay: prCollapseAT });
      gsap.to($prVert, { duration: prMoveAT * 0.8, drawSVG: '100% 70%', delay: prCollapseAT });
      gsap.to($prVert, {
        duration: prMoveAT * 0.3, drawSVG: '100% 99%', delay: prCollapseAT + prMoveAT * 0.5,
        onComplete: successAnim
      });
    };

    const progressAnim = () => {
      const status = { p: 0 };
      gsap.set($progress, { opacity: 1, delay: progressDelay });
      gsap.to(status, {
        duration: progressAT, p: 100, delay: progressDelay, ease: 'power1.inOut',
        onComplete: afterProgressAnim,
        onUpdate: () => {
          const _p = Math.ceil(status.p);
          $statusNumbers.innerHTML = _p;
          gsap.to($progress, { duration: 0.05, drawSVG: `${_p}%`, ease: 'power1.inOut' });
        }
      });
    };

    const trinagleAnim = () => {
      $status.classList.add('s--active');
      gsap.to($rotater, { duration: 0.1, opacity: 0 });
      gsap.to($tri, { duration: 0.2, opacity: 1 });
      gsap.to($tri, {
        duration: triAT * 0.10, drawSVG: '20%', ease: 'power1.inOut',
        onComplete: () => {
          $particlesStage2.classList.add('s--active');
          setTimeout(() => $particlesStage3.classList.add('s--active'), triAT * 0.3 * 1000);
        }
      });
      gsap.to($tri, { duration: triAT * 1.55, drawSVG: '90% 50%', delay: triAT * 0.01, ease: 'power1.out' });
      gsap.to($tri, {
        duration: triAT * 1.2, drawSVG: '100% 100%', opacity: 0, delay: triPhase2Delay, ease: 'power1.out',
        onComplete: progressAnim
      });
      gsap.to($circle, { duration: 0.1, scale: 0.5, opacity: 0, delay: 0 });
      gsap.set($triPiece, { opacity: 1, delay: triPhase2Delay - triAT * 0.01 });
      gsap.to($triPiece, { duration: triAT * 0.5, drawSVG: '100% 25%', delay: triPhase2Delay - triAT * 0.5 });
      gsap.to($triPiece, { duration: triAT * 0.5, drawSVG: '100% 100%', delay: triPhase2Delay });
      gsap.set($plc, { opacity: 1, delay: triPhase2Delay });
      gsap.to($plc, { duration: triAT * 0.3, drawSVG: '100% 1%', delay: triPhase2Delay });
    };

    const initDlAnim = () => {
      $dlSVG.classList.add('s--animating');
      gsap.to($arrMain, { duration: arrInitAT, drawSVG: '0.5px', y: -45 });
      gsap.to($arrSides, { duration: arrInitAT, drawSVG: '100% 100%' });
      gsap.to($arrMain, { duration: dotFadeAT, opacity: 0, delay: arrInitAT * 0.1 });
      gsap.to($rotater, { duration: dotFadeAT, opacity: 0, delay: arrInitAT });
      gsap.to($rotater, { duration: rtRotationAT, rotation: 722, delay: rtDelay, ease: 'power1.inOut' });
      gsap.to($rotater, { duration: rtRotationAT * 0.1, drawSVG: '20px', opacity: 0.4, delay: rtDelay });
      gsap.to($rotater, {
        duration: rtRotationAT * 0.15, drawSVG: '0.5px', opacity: 1, delay: rtDelay + rtRotationAT * 0.85,
        onComplete: trinagleAnim
      });
    };

    initDlAnim();

  }, { scope: container });

  return (
    <div className="dl-modal" ref={container}>
      <div className="dl-box">
        <svg className="dl-svg" viewBox="0 0 160 160">
          <path className="dl-svg__circle" d="M80,3 a77,77 0 1,0 0,154 a77,77 0 1,0 0,-154" />
          <path className="dl-svg__arrow dl-svg__arrow-main" d="M80,47 v66" />
          <path className="dl-svg__arrow dl-svg__arrow-side" d="M56,85 80,115" />
          <path className="dl-svg__arrow dl-svg__arrow-side" d="M104,85 80,115" />
          <path className="dl-svg__rotater" d="M80,3 a77,77 0 0,1 0,154 a77,77 0 0,1 0,-154" />
          <path className="dl-svg__progress-plc" d="M-77,207 h314" />
          <path className="dl-svg__triangle" d="M80,3 Q180,10 225,207 h-302" />
          <path className="dl-svg__triangle-piece" d="M225,207 h15" />
          <path className="dl-svg__progress" d="M-77,207 h314" />
          <path className="dl-svg__progress-vert" d="M80,207 80,3" />
          <path className="dl-svg__checkmark" d="M7,56 l74,52 l44,-56" />
        </svg>
        <div className="dl-status">
          <p className="dl-status__numbers">0</p>
          {/* A linha com <span className="dl-status__perc">%</span> foi removida */}
        </div>
        <div className="particles m--stage-2">
          {Array.from({ length: 10 }).map((_, i) => <div key={i} className="particles__p"></div>)}
        </div>
        <div className="particles m--stage-3">
          {Array.from({ length: 10 }).map((_, i) => <div key={i} className="particles__p"></div>)}
        </div>
      </div>
    </div>
  );
};

export default DownloadLoader;