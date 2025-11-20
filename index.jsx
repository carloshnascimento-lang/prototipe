import React, { useState, useEffect, useCallback } from 'react';

// --- DADOS DO QUIZ ---
const perguntas = [
    {
        id: 1,
        pergunta: 'Em que ano foi fundada a Universidade Federal de Viçosa?',
        alternativas: ['1922', '1926', '1948', '1951'],
        correta: 1, // índice da resposta correta (1926)
    },
    {
        id: 2,
        pergunta: 'Quantos campi a UFV possui atualmente?',
        alternativas: ['2', '3', '4', '5'],
        correta: 1, // 3 campi
    },
    {
        id: 3,
        pergunta: 'Qual é o curso mais tradicional e antigo da UFV?',
        alternativas: ['Engenharia Civil', 'Medicina Veterinária', 'Agronomia', 'Zootecnia'],
        correta: 2, // Agronomia
    },
    {
        id: 4,
        pergunta: 'Qual é o símbolo oficial da UFV?',
        alternativas: ['Leão', 'Águia', 'Coruja', 'Touro'],
        correta: 2, // Coruja
    },
    {
        id: 5,
        pergunta: 'Arthur da Silva Bernardes foi importante para a UFV porque:',
        alternativas: [
            'Foi o primeiro reitor',
            'Doou terras para a universidade',
            'Fundou o curso de Agronomia',
            'Foi presidente do Brasil e incentivou a criação da instituição',
        ],
        correta: 3,
    },
];

// --- MOCK DE DEPENDÊNCIAS (Para ser runnable em um único arquivo) ---
// Icones (Lucide Icons)
const Zap = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const Award = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8l-2 5.25L5 15l-1 5h14l-1-5-5-1.75L12 8z" /><circle cx="12" cy="5" r="3" /></svg>;
const Sparkles = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3s.5 2 2 3.5m0 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm10 0s-.5 2-2 3.5m0 0a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zM12 21v-3" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 17l1.5-1.5M7.5 7.5l-1.5-1.5M4 12h-3M21 12h-3M19.5 4.5l-1.5 1.5M6 19.5l-1.5-1.5" /></svg>;
// O QrCode não é mais usado na splash screen, mas mantemos o mock por segurança.
const QrCode = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 16v-4M16 16h4M16 16l-4 4" /></svg>;
const Trophy = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21l3-4H9l3 4zM16 8l2 5H6l2-5h8zM4 5h16M4 5a2 2 0 012-2h12a2 2 0 012 2M12 11V3" /></svg>;
const Gift = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8l-2 5.25L5 15l-1 5h14l-1-5-5-1.75L12 8z" /><circle cx="12" cy="5" r="3" /></svg>;
const Play = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.876v4.248a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const Crown = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v2m0 0v2m0-2h2M8 10h4M4 12h4m-4 0v2m0-2v2m16-2v2m-4-2v2m-4-2h4m-4 0v2m0-2v2m-4-2h4m-4 0v2m0-2v2m0-6h14a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2a2 2 0 002 2zM12 5.25v13.5" /></svg>;
const Star = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.152A1.5 1.5 0 0113.19 2.152l3.52 7.042 7.778 1.13a1.5 1.5 0 01.82 2.56l-5.632 5.492 1.332 7.77a1.5 1.5 0 01-2.176 1.584L12 18.067l-6.936 3.64a1.5 1.5 0 01-2.176-1.584l1.332-7.77-5.632-5.492a1.5 1.5 0 01.82-2.56l7.778-1.13 3.52-7.042z" /></svg>;
const LogOut = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m6 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ArrowLeft = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const CheckCircle = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const XCircle = (props) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


// Mock de Roteamento
const mockCreatePageUrl = (pageName) => pageName; // Retorna o nome da view

// Mock de Animação (Substituindo framer-motion por classes e keyframes)
const MotionDiv = ({ className, children, style, ...rest }) => (
    <div
        className={`${className} transition-all duration-700 ease-out`}
        style={style}
        {...rest}
    >
        {children}
    </div>
);

// Componentes de UI simulados (Button, Card)
const Button = ({ children, onClick, variant, size, className, disabled, ...props }) => {
    let baseStyle = "px-4 py-2 font-semibold rounded-xl transition-all duration-300 ";
    
    if (variant === 'ghost') {
        baseStyle += "bg-transparent hover:bg-white/10 text-purple-300";
    } else if (variant === 'outline') {
        baseStyle += "border border-purple-500/50 hover:bg-white/10 text-white"; 
    } else {
        // Permite que o className externo defina o background.
        baseStyle += "bg-transparent text-white"; 
    }

    if (size === 'lg') {
        baseStyle = baseStyle.replace('px-4 py-2', 'px-6 py-3');
    }

    const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <button
            onClick={onClick}
            className={`${baseStyle} ${className} ${disabledStyle}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

const Card = ({ children, className }) => (
    <div className={`rounded-2xl border border-gray-700 shadow-xl ${className}`}>
        {children}
    </div>
);
const CardHeader = ({ children }) => <div className="p-4 border-b border-purple-500/20">{children}</div>;
const CardTitle = ({ children, className }) => <h3 className={`text-xl font-bold text-white ${className}`}>{children}</h3>;
const CardContent = ({ children, className }) => <div className={`p-6 ${className}`}>{children}</div>;

// CUSTOM MODAL (Replacing alert())
const CustomAlert = ({ message, type, onClose }) => {
    if (!message) return null;

    const colors = {
        success: { bg: 'bg-green-600', text: 'text-white', icon: '✅' },
        error: { bg: 'bg-red-600', text: 'text-white', icon: '❌' },
        info: { bg: 'bg-blue-600', text: 'text-white', icon: 'ℹ️' },
    };

    const style = colors[type] || colors.info;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 backdrop-blur-sm">
            <div className={`${style.bg} ${style.text} rounded-xl p-6 shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100 border border-white/20`}>
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{style.icon}</span>
                    <p className="font-semibold text-lg">{message}</p>
                </div>
                <Button onClick={onClose} className="mt-4 w-full bg-white bg-opacity-20 hover:bg-opacity-30 border-0">
                    Fechar
                </Button>
            </div>
        </div>
    );
};

// CSS para Animações
const customStyles = `
    @keyframes particle-fade {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1); opacity: 1; }
        100% { transform: scale(0); opacity: 0; }
    }

    @keyframes pulse-glow {
        0% { box-shadow: 0 0 60px rgba(168, 85, 247, 0.4), 0 0 20px rgba(34, 211, 238, 0.2); }
        50% { box-shadow: 0 0 100px rgba(34, 211, 238, 0.6), 0 0 40px rgba(168, 85, 247, 0.6); }
        100% { box-shadow: 0 0 60px rgba(168, 85, 247, 0.4), 0 0 20px rgba(34, 211, 238, 0.2); }
    }

    .particle {
        animation: particle-fade infinite;
    }

    .qr-glow {
        animation: pulse-glow 2s infinite ease-in-out;
    }

    .fade-in {
        opacity: 0;
        animation: fadeIn 0.8s forwards;
    }

    @keyframes fadeIn {
        to { opacity: 1; }
    }

    .animate-bounce-icon {
        animation: bounce 0.6s ease-in-out;
    }
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    /* Estilo para o círculo do timer */
    .timer-ring {
        transition: stroke-dashoffset 1s linear;
        transform: rotate(-90deg);
        transform-origin: 50% 50%;
    }

    /* NOVA ANIMAÇÃO DO BOTÃO DE INICIAR (Para garantir visibilidade) */
    @keyframes button-glow-v2 {
        /* Gradiente de glow roxo/ciano */
        0%, 100% { box-shadow: 0 0 15px rgba(139, 92, 246, 0.6), 0 0 40px rgba(52, 211, 235, 0.4); }
        50% { box-shadow: 0 0 25px rgba(139, 92, 246, 0.9), 0 0 60px rgba(52, 211, 235, 0.6); }
    }
    .button-glow-v2 {
        animation: button-glow-v2 3s infinite ease-in-out;
    }
`;

// Função auxiliar para aplicar delay na simulação de animação
const getDelayStyle = (delay) => ({ animationDelay: `${delay}s` });

// --- COMPONENTE DO QUIZ (Antigo renderGame) ---
const Game = ({ user, setUser, handleNavigation, setMessage, setMessageType }) => {
    // --- CONSTANTES DO JOGO ---
    const MAX_TIME = 30;
    const TOTAL_QUESTIONS = perguntas.length;

    // --- GAME STATE ---
    const [perguntaAtual, setPerguntaAtual] = useState(0);
    const [pontuacao, setPontuacao] = useState(0);
    const [respostaSelecionada, setRespostaSelecionada] = useState(null);
    const [mostrarResultado, setMostrarResultado] = useState(false);
    const [jogoFinalizado, setJogoFinalizado] = useState(false);
    const [timeLeft, setTimeLeft] = useState(MAX_TIME);
    const [lastScoreEarned, setLastScoreEarned] = useState(0);

    const finalizarJogo = useCallback((pontuacaoFinal) => {
        const pontuacaoAnterior = user.score || 0;
        const novaPontuacao = pontuacaoAnterior + pontuacaoFinal;

        // Update the top-level user score
        setUser(prev => ({ ...prev, score: novaPontuacao }));
        
        // Set alert message
        setMessage(`🎉 Você completou o Quiz! Ganhou ${pontuacaoFinal} pontos nesta rodada.`);
        setMessageType('success');
        
        setJogoFinalizado(true);
    }, [user.score, setUser, setMessage, setMessageType]);

    // Lógica para avançar a pergunta ou finalizar o jogo
    const advanceGame = useCallback(() => {
        if (perguntaAtual < TOTAL_QUESTIONS - 1) {
            setPerguntaAtual(prev => prev + 1);
            setRespostaSelecionada(null);
            setMostrarResultado(false);
            setTimeLeft(MAX_TIME); // Reset timer state for the next question
        } else {
            finalizarJogo(pontuacao); 
        }
    }, [perguntaAtual, pontuacao, TOTAL_QUESTIONS, finalizarJogo]);


    // --- EFEITO DO TEMPORIZADOR ---
    useEffect(() => {
        if (jogoFinalizado || respostaSelecionada !== null) return;

        // Reset timer if it's the start of a new question
        if (timeLeft === MAX_TIME) {
            // Only start the countdown from MAX_TIME if it was reset for a new question
        }

        const interval = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(interval);
                    // Lógica de Fim de Tempo:
                    setRespostaSelecionada(-2); // -2 indica 'Tempo Esgotado'
                    setMostrarResultado(true);
                    setLastScoreEarned(0); // Pontos zerados

                    // Avança após 3s
                    setTimeout(advanceGame, 3000);

                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [perguntaAtual, jogoFinalizado, respostaSelecionada, advanceGame]); // Adicionado advanceGame às dependências

    // --- HANDLER DE RESPOSTA ---
    const handleResposta = (indice) => {
        if (respostaSelecionada !== null || jogoFinalizado) return;

        setRespostaSelecionada(indice);
        const estaCorreta = indice === perguntas[perguntaAtual].correta;
        
        let scoreEarned = 0;
        
        if (estaCorreta) {
            // Cálculo de Pontuação Dinâmica: Base 100 + Bônus (0 a 100)
            const timeBonus = Math.floor((timeLeft / MAX_TIME) * 100); 
            const basePoints = 100;
            scoreEarned = basePoints + timeBonus; 
            
            setPontuacao(prevScore => prevScore + scoreEarned);
        }
        
        setLastScoreEarned(scoreEarned); // Salva a pontuação ganha para exibição
        
        // 1. Mostrar resultado após 1s
        setTimeout(() => {
            setMostrarResultado(true);
        }, 1000);

        // 2. Avançar ou finalizar após 3s
        setTimeout(advanceGame, 3000);
    };

    const voltarDashboard = () => {
        handleNavigation('dashboard');
    };

    // --- RENDER JOGO FINALIZADO ---
    if (jogoFinalizado) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 fade-in">
                <MotionDiv
                    className="max-w-2xl w-full"
                >
                    <Card className="backdrop-blur-xl bg-white/5 border-purple-500/20 overflow-hidden">
                        <CardContent className="p-12 text-center">
                            <div
                                className="mb-8 animate-bounce-icon"
                            >
                                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 shadow-2xl">
                                    <Trophy className="w-16 h-16 text-white" />
                                </div>
                            </div>

                            <h1 className="text-5xl font-black text-white mb-4">
                                Parabéns!
                            </h1>
                            <p className="text-xl text-purple-200 mb-8">
                                Você completou o quiz da UFV
                            </p>

                            <div className="bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border-2 border-cyan-400/50 rounded-2xl p-8 mb-8">
                                <p className="text-purple-300 mb-2">Pontuação desta rodada</p>
                                <p className="text-6xl font-black text-white mb-2">
                                    {pontuacao}
                                </p>
                                <p className="text-sm text-purple-300">
                                    {pontuacao === TOTAL_QUESTIONS * 200 ? '🎉 Pontuação perfeita! Acumulada no total.' : 
                                     pontuacao >= TOTAL_QUESTIONS * 200 * 0.6 ? '🌟 Excelente resultado!' : 
                                     '💪 Continue praticando!'}
                                </p>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <Button
                                    onClick={voltarDashboard}
                                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold rounded-xl px-8 py-4 text-lg"
                                >
                                    <ArrowLeft className="w-5 h-5 mr-2" />
                                    Voltar ao Dashboard
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </MotionDiv>
            </div>
        );
    }

    // --- RENDER QUIZ ATUAL ---
    const pergunta = perguntas[perguntaAtual];
    const progresso = ((perguntaAtual + 1) / TOTAL_QUESTIONS) * 100;
    
    // Configurações do Timer Ring
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (timeLeft / MAX_TIME) * circumference;
    const timerColor = timeLeft <= 5 ? 'text-red-500' : 'text-cyan-400';

    return (
        <div className="relative z-10 w-full min-h-screen">
            {/* Header do Quiz */}
            <div className="sticky top-0 z-20 border-b border-purple-500/20 backdrop-blur-xl bg-white/5">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <Button
                            onClick={voltarDashboard}
                            variant="ghost"
                            className="text-purple-300 hover:text-white hover:bg-white/10"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Sair
                        </Button>

                        {/* Timer Centralizado */}
                        <div className="relative w-14 h-14 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
                                <circle
                                    className="text-white/20"
                                    strokeWidth="4"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r={radius}
                                    cx="22"
                                    cy="22"
                                />
                                <circle
                                    className={`timer-ring ${timerColor}`}
                                    strokeWidth="4"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={offset}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r={radius}
                                    cx="22"
                                    cy="22"
                                />
                            </svg>
                            <span className={`absolute text-xl font-black ${timerColor}`}>{timeLeft}</span>
                        </div>
                        
                        {/* Pontuação */}
                        <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            <span className="text-2xl font-black text-white">{pontuacao}</span>
                            <span className="text-purple-300">pontos</span>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                        <MotionDiv
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-cyan-600"
                            style={{ width: `${progresso}%` }} // Simula a animação de width
                        />
                    </div>
                    <p className="text-sm text-purple-300 mt-2 text-center">
                        Pergunta {perguntaAtual + 1} de {TOTAL_QUESTIONS}
                    </p>
                </div>
            </div>

            {/* Quiz Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
                <MotionDiv
                    key={perguntaAtual} // Usa a key para simular a transição (re-renderização)
                    className="fade-in" // Classe que simula a entrada
                >
                    <Card className="backdrop-blur-xl bg-white/5 border-purple-500/20 mb-8">
                        <CardContent className="p-8">
                            <h2 className="text-3xl font-bold text-white mb-8 leading-relaxed">
                                {pergunta.pergunta}
                            </h2>

                            <div className="grid gap-4">
                                {pergunta.alternativas.map((alternativa, indice) => {
                                    const isSelected = respostaSelecionada === indice;
                                    const isCorrect = indice === pergunta.correta;
                                    const isTimeUp = respostaSelecionada === -2;

                                    // Mostra o resultado final (correta em verde, incorreta em vermelho, ou tempo esgotado)
                                    const showResult = mostrarResultado && (isSelected || isTimeUp);

                                    // Determina o estilo final
                                    let buttonClass = 'bg-white/5 border-purple-500/20 text-purple-100 hover:bg-white/10 hover:border-purple-500/40';
                                    
                                    if (showResult) {
                                        if (isCorrect && (isSelected || isTimeUp)) { // A resposta correta é destacada
                                            buttonClass = 'bg-green-600/30 border-green-500 text-white';
                                        } else if (isSelected && !isCorrect) { // Resposta errada selecionada
                                            buttonClass = 'bg-red-600/30 border-red-500 text-white';
                                        } else if (isTimeUp && isCorrect) { // Tempo esgotado, mas era essa a correta (destaque discreto)
                                             buttonClass = 'bg-green-600/30 border-green-500/50 text-white opacity-70';
                                        } else if (isTimeUp && !isCorrect) { // Tempo esgotado, e não era essa
                                            buttonClass = 'bg-white/5 border-purple-500/20 text-purple-100 opacity-50';
                                        } else if (!isSelected && isCorrect) { // Mostra a correta se a errada foi selecionada
                                             buttonClass = 'bg-green-600/30 border-green-500/50 text-white opacity-70';
                                        }
                                    } else if (isSelected) {
                                        buttonClass = 'bg-cyan-600/30 border-cyan-500 text-white';
                                    }
                                    
                                    return (
                                        <button
                                            key={indice}
                                            onClick={() => handleResposta(indice)}
                                            disabled={respostaSelecionada !== null}
                                            className={`p-6 rounded-xl text-left font-medium transition-all duration-300 border-2 ${buttonClass} disabled:cursor-not-allowed`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg">{alternativa}</span>
                                                {mostrarResultado && (
                                                    <span className="transition-transform duration-300 transform scale-100">
                                                        {(isCorrect && (isSelected || isTimeUp || (respostaSelecionada !== -2 && respostaSelecionada !== isCorrect))) ? (
                                                            <CheckCircle className="w-6 h-6 text-green-400" />
                                                        ) : (isSelected && !isCorrect) || (isTimeUp && !isCorrect && isSelected) ? (
                                                            <XCircle className="w-6 h-6 text-red-400" />
                                                        ) : null}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {mostrarResultado && (
                        <MotionDiv
                            className="text-center fade-in"
                        >
                            <Card className={`backdrop-blur-xl border-2 ${
                                respostaSelecionada === perguntas[perguntaAtual].correta
                                    ? 'bg-green-600/20 border-green-500/50'
                                    : 'bg-red-600/20 border-red-500/50'
                            }`}>
                                <CardContent className="p-6">
                                    <p className="text-2xl font-bold text-white">
                                        {respostaSelecionada === perguntas[perguntaAtual].correta 
                                            ? `🎉 Correto! +${lastScoreEarned} pontos`
                                            : respostaSelecionada === -2
                                            ? '⏰ Tempo esgotado!'
                                            : '❌ Resposta incorreta'}
                                    </p>
                                </CardContent>
                            </Card>
                        </MotionDiv>
                    )}
                </MotionDiv>
            </div>
        </div>
    );
};


// --- COMPONENTE PRINCIPAL ---
export default function App() {
    // --- AUTH/STATE (Simulando views e dados) ---
    // Top-level routing state: 'splash', 'login', 'dashboard', 'jogo'
    const [view, setView] = useState('splash');
    
    // User/Score state replacing localStorage
    const [user, setUser] = useState({ name: 'Visitante UFV', score: 780 });
    const [activeTab, setActiveTab] = useState('ranking');

    // Alert/Message state
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('info');

    const navigate = setView; // Use setView as the mock navigator
    const createPageUrl = mockCreatePageUrl;


    const handleNavigation = useCallback((targetView) => {
        // Simula navegação entre views
        if (targetView === 'Acesso') {
             // Simula login: vai para a tela de login
            setView('login');
        } else if (targetView === 'loginSuccess') {
             // Simula sucesso do login e redireciona para o dashboard
            setUser(prev => ({ ...prev, name: 'Estudante UFV', score: prev.score || 780 })); // Mantém pontuação se existir
            setView('dashboard');
        }
        else if (targetView === 'Index') {
            setView('splash');
        } else {
            setView(targetView);
        }
    }, [setView]);

    // --- DASHBOARD LOGIC ---

    const handleLogout = () => {
        setUser({ name: 'Visitante UFV', score: 0 }); // Simula logout
        handleNavigation('Index');
    };

    // Dados simulados
    const ranking = [
        { name: 'João Silva', score: 950, avatar: '👨' },
        { name: 'Maria Santos', score: 890, avatar: '👩' },
        { name: 'Pedro Costa', score: 850, avatar: '👨‍🦱' },
        { name: user?.name || 'Você', score: user?.score || 0, avatar: '🎮', isUser: true },
        { name: 'Ana Paula', score: 720, avatar: '👩‍🦰' },
        { name: 'Carlos Souza', score: 680, avatar: '👨‍🦳' },
    ].sort((a, b) => b.score - a.score);

    const prizes = [
        { id: 1, name: 'Camiseta UFV Premium', cost: 500, image: '👕', available: true },
        { id: 2, name: 'Caneca Térmica UFV', cost: 300, image: '☕', available: true },
        { id: 3, name: 'Mochila UFV Limited', cost: 800, image: '🎒', available: true },
        { id: 4, name: 'Boné UFV Exclusivo', cost: 250, image: '🧢', available: true },
        { id: 5, name: 'Kit Canetas UFV', cost: 150, image: '✏️', available: true },
        { id: 6, name: 'Troféu UFV Master', cost: 1200, image: '🏆', available: false },
    ];

    const handleResgatar = (prize) => {
        if (user.score >= prize.cost) {
            const newScore = user.score - prize.cost;
            setUser({ ...user, score: newScore });
            setMessage(`🎉 Prêmio "${prize.name}" resgatado com sucesso!`);
            setMessageType('success');
        } else {
            setMessage('❌ Pontos insuficientes! Você precisa de mais ' + (prize.cost - user.score) + ' pontos.');
            setMessageType('error');
        }
    };

    const handleCloseAlert = () => setMessage(null);


    // --- VIEWS ---

    const renderSplash = () => (
        <div key="splash" className="h-screen flex flex-col items-center justify-center p-8 relative z-10 fade-in">
            <MotionDiv className="h-full flex flex-col items-center justify-center w-full">
                {/* Logo/Título */}
                <div className="text-center mb-12 fade-in" style={getDelayStyle(0.2)}>
                    <div className="inline-flex items-center gap-3 mb-6">
                        <Zap className="w-12 h-12 text-cyan-400" />
                        <h1 className="text-7xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400">
                            UFV QUIZ
                        </h1>
                        <Award className="w-12 h-12 text-purple-400" />
                    </div>
                    <p className="text-lg md:text-2xl text-purple-200 font-light tracking-wide max-w-lg">
                        Teste seus conhecimentos e ganhe prêmios incríveis
                    </p>
                </div>

                {/* Cards de Features */}
                <div
                    className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full"
                    style={getDelayStyle(0.5)}
                >
                    {[
                        { icon: Sparkles, title: 'Perguntas Exclusivas', desc: 'Sobre a história da UFV' },
                        { icon: Award, title: 'Prêmios Reais', desc: 'Resgate suas conquistas' },
                        { icon: Zap, title: 'Ranking ao Vivo', desc: 'Compete com outros jogadores' },
                    ].map((feature, idx) => (
                        <div
                            key={idx}
                            className="backdrop-blur-xl bg-white/5 border border-purple-500/20 rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:bg-white/10"
                            style={getDelayStyle(0.7 + idx * 0.2)}
                        >
                            <feature.icon className="w-10 h-10 text-cyan-400 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-purple-200">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* BOTÃO INICIAR - ROXO/CIANO E TEXTO BRANCO */}
                <MotionDiv 
                    className="mt-12 w-full max-w-xs md:max-w-md fade-in" 
                    style={getDelayStyle(1.0)}
                >
                    <Button
                        onClick={() => handleNavigation(createPageUrl('Acesso'))}
                        size="lg"
                        // Fundo com gradiente e texto branco para contraste máximo
                        className="w-full h-16 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-extrabold rounded-xl text-xl border-2 border-cyan-400 shadow-2xl shadow-purple-500/50 hover:scale-[1.05] transition-all duration-300 uppercase tracking-wider button-glow-v2 flex justify-center items-center"
                    >
                        Iniciar Quiz Agora
                    </Button>
                </MotionDiv>
            </MotionDiv>
        </div>
    );

    const renderLogin = () => (
        <div key="login" className="min-h-screen flex items-center justify-center p-4 fade-in">
            <MotionDiv className="max-w-md w-full">
                <Card className="backdrop-blur-xl bg-white/5 border-purple-500/20 overflow-hidden text-center">
                    <CardContent className="p-12">
                        <Zap className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-white mb-4">Acesso de Jogador</h2>
                        <p className="text-purple-200 mb-8">
                            Entre com sua conta UFV para começar
                        </p>

                        {/* Simulação de Campos de Login */}
                        <div className="space-y-4 mb-8">
                            {/* INPUT MOCK */}
                            <input
                                type="text"
                                placeholder="Matrícula UFV ou E-mail"
                                className="w-full p-3 rounded-xl bg-white/10 border border-purple-500/30 text-white placeholder-purple-300 focus:ring-2 focus:ring-cyan-400 outline-none transition-all"
                                defaultValue="aluno.teste@ufv.br"
                            />
                            <input
                                type="password"
                                placeholder="Senha (Mock)"
                                className="w-full p-3 rounded-xl bg-white/10 border border-purple-500/30 text-white placeholder-purple-300 focus:ring-2 focus:ring-cyan-400 outline-none transition-all"
                                defaultValue="123456"
                            />
                        </div>

                        <Button
                            onClick={() => handleNavigation(createPageUrl('loginSuccess'))} 
                            className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-700 hover:from-cyan-400 hover:to-purple-600 text-white font-extrabold rounded-xl text-lg uppercase tracking-wider shadow-lg shadow-cyan-500/30 hover:scale-[1.02] transition-all duration-300"
                        >
                            Entrar e Jogar
                        </Button>
                        <button
                            onClick={() => handleNavigation(createPageUrl('splash'))}
                            className="mt-4 text-sm text-purple-300 hover:text-white transition-colors"
                        >
                            &larr; Voltar
                        </button>
                    </CardContent>
                </Card>
            </MotionDiv>
        </div>
    );

    const renderDashboard = () => (
        <div key="dashboard" className="relative z-10 w-full min-h-screen pt-12 md:pt-0 fade-in">
            {/* Header */}
            <div className="sticky top-0 z-20 border-b border-purple-500/20 backdrop-blur-xl bg-white/5">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-white">UFV Quiz</h1>
                                <p className="text-xs text-purple-300">Dashboard do Jogador</p>
                            </div>
                        </div>
                        <Button
                            onClick={handleLogout}
                            variant="ghost"
                            className="text-purple-300 hover:text-white hover:bg-white/10"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sair
                        </Button>
                    </div>
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
                {/* Score Banner */}
                <MotionDiv
                    className="mb-8 fade-in"
                >
                    <Card className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border-purple-500/30 backdrop-blur-xl overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 animate-pulse" />
                        <CardContent className="p-8 relative z-10">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                                        <Trophy className="w-10 h-10 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-black text-white mb-1">
                                            {user?.score || 0} <span className="text-2xl text-purple-300">pontos</span>
                                        </h2>
                                        <p className="text-purple-200">Olá, {user?.name || 'Jogador'}</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => handleNavigation(createPageUrl('jogo'))}
                                    size="lg"
                                    className="w-full md:w-auto h-16 px-8 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold rounded-xl text-xl shadow-2xl shadow-purple-500/50 hover:scale-105 transition-all duration-300"
                                >
                                    <Play className="w-6 h-6 mr-3" />
                                    Jogar Agora
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </MotionDiv>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 backdrop-blur-xl bg-white/5 border border-purple-500/20 rounded-xl p-2 w-full max-w-sm">
                    {[
                        { id: 'ranking', label: 'Ranking', icon: Crown },
                        { id: 'premios', label: 'Prêmios', icon: Gift },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                activeTab === tab.id
                                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                                    : 'text-purple-300 hover:bg-white/5'
                            }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {activeTab === 'ranking' && (
                    <MotionDiv
                        className="grid lg:grid-cols-1 gap-6 fade-in"
                    >
                        <Card className="backdrop-blur-xl bg-white/5 border-purple-500/20">
                            <CardHeader>
                                <CardTitle className="text-2xl font-black text-white flex items-center gap-3">
                                    <Crown className="w-7 h-7 text-yellow-400" />
                                    Top Jogadores
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {ranking.map((player, index) => (
                                        <MotionDiv
                                            key={index}
                                            className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 fade-in`}
                                            style={getDelayStyle(index * 0.1)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    {index < 3 && (
                                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-black">
                                                            {index + 1}
                                                        </div>
                                                    )}
                                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-xl flex items-center justify-center text-2xl">
                                                        {player.avatar}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className={`font-bold ${player.isUser ? 'text-cyan-400' : 'text-white'}`}>
                                                        {player.name} {player.isUser && '(Você)'}
                                                    </p>
                                                    <p className="text-sm text-purple-300">
                                                        {index < 3 ? ['🥇 Campeão', '🥈 Vice', '🥉 Terceiro'][index] : `#${index + 1} posição`}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-black text-white">{player.score}</p>
                                                <p className="text-xs text-purple-300">pontos</p>
                                            </div>
                                        </MotionDiv>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </MotionDiv>
                )}

                {activeTab === 'premios' && (
                    <MotionDiv
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in"
                    >
                        {prizes.map((prize, index) => (
                            <MotionDiv
                                key={prize.id}
                                className="fade-in"
                                style={getDelayStyle(index * 0.1)}
                            >
                                <Card className="backdrop-blur-xl bg-white/5 border-purple-500/20 hover:border-cyan-500/40 transition-all duration-300 h-full">
                                    <CardContent className="p-6 flex flex-col justify-between h-full">
                                        <div>
                                            <div className="text-6xl mb-4 text-center">{prize.image}</div>
                                            <h3 className="text-lg font-bold text-white mb-2 text-center">
                                                {prize.name}
                                            </h3>
                                            <div className="flex items-center justify-center gap-2 mb-4">
                                                <Star className="w-5 h-5 text-yellow-400" />
                                                <span className="text-2xl font-black text-cyan-400">{prize.cost}</span>
                                                <span className="text-purple-300">pontos</span>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => handleResgatar(prize)}
                                            disabled={!prize.available || (user?.score || 0) < prize.cost}
                                            className={`mt-auto w-full ${
                                                prize.available && (user?.score || 0) >= prize.cost
                                                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700'
                                                    : 'bg-gray-600'
                                            } text-white font-bold rounded-xl`}
                                        >
                                            {!prize.available
                                                ? 'Indisponível'
                                                : (user?.score || 0) >= prize.cost
                                                ? 'Resgatar'
                                                : 'Pontos Insuficientes'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </MotionDiv>
                        ))}
                    </MotionDiv>
                )}
            </div>
        </div>
    );


    // --- RENDERIZADOR PRINCIPAL ---
    const renderContent = () => {
        const gameProps = { user, setUser, handleNavigation, setMessage, setMessageType };

        switch (view) {
            case 'splash':
                return renderSplash();
            case 'login':
                return renderLogin();
            case 'dashboard':
                return renderDashboard();
            case 'jogo':
                // Chamando o componente Game como JSX, não como função.
                return <Game {...gameProps} />; 
            default:
                return renderSplash();
        }
    };


    return (
        <>
            {/* Estilos customizados injetados */}
            <style>{customStyles}</style>

            <div className="min-h-screen font-sans bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
                {/* Partículas de fundo animadas */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(view === 'dashboard' ? 30 : 20)].map((_, i) => (
                        <div
                            key={i}
                            className={`absolute w-1 h-1 rounded-full particle ${view === 'dashboard' ? 'bg-cyan-400' : 'bg-purple-400'}`}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDuration: `${3 + Math.random() * 2}s`,
                                animationDelay: `${Math.random() * 2}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Main Content View Switch */}
                {renderContent()}

            </div>

            {/* Custom Alert Modal */}
            <CustomAlert
                message={message}
                type={messageType}
                onClose={handleCloseAlert}
            />
        </>
    );
}