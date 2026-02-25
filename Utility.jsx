import React, { useState } from 'react';
import { Copy, Check, Wand2, Loader2, MessageSquare, AlertCircle, Shield } from 'lucide-react';

const apiKey = ""; // API 키는 실행 환경에서 자동 주입됩니다.

// 지수 백오프를 적용한 API 호출 함수
const fetchWithRetry = async (url, options, retries = 5) => {
  const delays = [1000, 2000, 4000, 8000, 16000];
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`서버 에러가 발생했습니다. (상태 코드: ${response.status})`);
      }
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delays[i]));
    }
  }
};

export default function App() {
  const [target, setTarget] = useState('직장 상사');
  const [situation, setSituation] = useState('');
  const [tone, setTone] = useState('급성 장염, 노로바이러스, 피할 수 없는 집안일 등 상대방이 절대 의심하거나 되물을 수 없는 매우 현실적이고 구체적인 이유로 (가상의 병명 금지, 장난기 절대 없이 진지하게)');
  
  const [generatedExcuse, setGeneratedExcuse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const targetOptions = ['직장 상사', '직장 동료', '친한 친구', '어색한 지인', '연인', '가족'];
  const toneOptions = [
    { label: '정중/진지', value: '정중하고 진지하게, 예의 바르게', icon: '👔' },
    { label: '유머/재치', value: '유머러스하고 재치있게, 장난스럽게', icon: '🤪' },
    { label: '반박불가', value: '급성 장염, 노로바이러스, 피할 수 없는 집안일 등 상대방이 절대 의심하거나 되물을 수 없는 매우 현실적이고 구체적인 이유로 (가상의 병명 금지, 장난기 절대 없이 진지하게)', icon: '🛡️' },
    { label: '아련/감성', value: '아련하고 미안함이 뚝뚝 묻어나는 감성적인 말투로', icon: '🥺' }
  ];

  const generateExcuse = async () => {
    if (!situation.trim()) {
      setError('어떤 상황인지 입력해주세요! (예: 오늘 저녁 팀 회식)');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedExcuse('');
    setCopied(false);

    const systemInstruction = `당신은 'ExcuseGPT(핑계봇)'입니다. 당신의 목표는 사용자가 원치 않는 일정(회식, 약속 등)에서 빠져나올 수 있도록 완벽한 핑계를 만들어주는 것입니다. 
    핵심 원칙:
    1. 철저하게 카카오톡 등 메신저에서 바로 '복사+붙여넣기' 할 수 있는 자연스러운 1인칭 대화체로 작성할 것.
    2. 불필요한 인사말이나 설명(예: "이렇게 보내보세요:")은 절대 넣지 말고 오직 메시지 본문만 출력할 것.
    3. 길이는 1~3문장 내외로 간결하게.
    4. 요청받은 '대상'과 '톤앤매너'를 완벽하게 반영할 것. 보낼 대상이 '상사'나 '어색한 지인'일 경우 절대 장난스럽거나 비현실적인 변명을 하지 말고 극도로 현실적일 것.`;

    const userQuery = `[요청사항]
    - 보낼 대상: ${target}
    - 피하고 싶은 상황: ${situation}
    - 원하는 말투: ${tone}
    
    위 조건에 맞춰서 보낼 메시지를 작성해줘.`;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] }
      };

      const data = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        setGeneratedExcuse(text.trim());
      } else {
        throw new Error('응답을 생성하지 못했습니다.');
      }
    } catch (err) {
      setError('핑계 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedExcuse) return;
    
    // iframe 환경에서의 복사를 위한 fallback
    const textArea = document.createElement("textarea");
    textArea.value = generatedExcuse;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패', err);
      setError('클립보드 복사에 실패했습니다. 텍스트를 직접 선택해서 복사해주세요.');
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-800 p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        
        {/* 헤더 섹션 */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
            Excuse<span className="text-indigo-600">GPT</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-medium">
            "고민은 AI가, 당신은 복사만"
          </p>
          <p className="text-sm text-gray-500 mt-2">당신의 완벽한 사회적 방패 🛡️</p>
        </header>

        <main className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
          
          {/* 입력 폼 */}
          <div className="space-y-8">
            
            {/* 1. 대상 선택 */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700">
                1. 누구에게 보내는 핑계인가요?
              </label>
              <div className="flex flex-wrap gap-2">
                {targetOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setTarget(opt)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      target === opt
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. 상황 입력 */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700" htmlFor="situation">
                2. 어떤 상황을 피하고 싶나요?
              </label>
              <div className="relative">
                <input
                  id="situation"
                  type="text"
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  placeholder="예: 오늘 저녁 팀 회식, 이번 주말 동호회 등산"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 placeholder-gray-400"
                  onKeyDown={(e) => e.key === 'Enter' && generateExcuse()}
                />
                <MessageSquare className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* 3. 톤앤매너 선택 */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700">
                3. 어떤 톤으로 말할까요?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {toneOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setTone(opt.value)}
                    className={`p-3 rounded-xl border-2 text-left flex items-center gap-2 transition-all ${
                      tone === opt.value
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <span className="font-semibold text-sm">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 생성 버튼 */}
            <button
              onClick={generateExcuse}
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200/50 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  AI가 핑계를 지어내는 중...
                </>
              ) : (
                <>
                  <Wand2 className="w-6 h-6" />
                  완벽한 핑계 생성하기
                </>
              )}
            </button>

            {/* 에러 메시지 */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl text-sm font-medium">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>
        </main>

        {/* 결과 표시 섹션 */}
        {generatedExcuse && (
          <div className="mt-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
              <div className="px-6 py-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
                <span className="text-gray-300 font-medium text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  생성된 핑계 메시지
                </span>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    copied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? '복사완료!' : '카톡 복붙하기'}
                </button>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-white text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-medium">
                  {generatedExcuse}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <footer className="mt-12 text-center text-sm text-gray-400">
          <p>이 서비스가 생성한 핑계로 인해 발생하는 인간관계 문제는 책임지지 않습니다 😉</p>
        </footer>

      </div>
    </div>
  );
}