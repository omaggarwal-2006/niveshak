import React, { useState } from 'react';
import { 
  TrendingUp, 
  Flame, 
  ShieldAlert, 
  Zap, 
  HelpCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  DollarSign, 
  Calculator,
  Percent,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function InteractiveCalculator({ type, lang }) {
  // Common state values
  const [amount, setAmount] = useState(() => {
    if (type === 'inflation') return 25000;
    if (type === 'comparison') return 5000;
    return 5000; // SIP default
  });
  
  const [years, setYears] = useState(15);
  const [returnRate, setReturnRate] = useState(12); // SIP standard
  const [stepUpPct, setStepUpPct] = useState(10); // 10% annual step-up default
  const [inflationRate, setInflationRate] = useState(7); // 7% CPI default
  
  // FIRE Specific States
  const [currentAge, setCurrentAge] = useState(25);
  const [monthlyExpense, setMonthlyExpense] = useState(40000);
  const [fireMultiplier, setFireMultiplier] = useState(25); // 25x annual expenses

  const getTxt = (en, hi) => (lang === 'en' ? en : hi);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // 0. FIRE (Financial Independence, Retire Early) CALCULATION
  const calculateFIRE = () => {
    let age = parseInt(currentAge);
    let currentExpenseAnnual = parseFloat(monthlyExpense) * 12;
    let currentCorpus = 0;
    
    const infRate = parseFloat(inflationRate) / 100;
    const invRate = parseFloat(returnRate) / 100;
    const annualInvestment = parseFloat(amount) * 12; // 'amount' is used as monthly investment
    
    const yearByYearData = [];
    let fireAchieved = false;
    let achievedAge = null;
    let fireTargetAtAchieved = 0;

    for (let yr = 1; yr <= 60; yr++) {
      // End of year calculations
      currentCorpus = currentCorpus * (1 + invRate) + annualInvestment;
      currentExpenseAnnual = currentExpenseAnnual * (1 + infRate);
      
      const fireTarget = currentExpenseAnnual * fireMultiplier;
      
      yearByYearData.push({
        age: age + yr,
        corpus: Math.round(currentCorpus),
        target: Math.round(fireTarget),
        annualExpense: Math.round(currentExpenseAnnual)
      });
      
      if (!fireAchieved && currentCorpus >= fireTarget) {
        fireAchieved = true;
        achievedAge = age + yr;
        fireTargetAtAchieved = Math.round(fireTarget);
      }
    }

    return {
      achievedAge,
      fireTargetAtAchieved,
      yearlyData: yearByYearData
    };
  };

  // 1. STEP-UP SIP & COMPOUND INTEREST CALCULATION
  const calculateStepUpSIP = () => {
    const P = parseFloat(amount);
    const r = parseFloat(returnRate) / 100;
    const stepUp = parseFloat(stepUpPct) / 100;
    const totalYears = parseInt(years);

    let currentMonthlySIP = P;
    let totalInvested = 0;
    let currentWealth = 0;

    const yearByYearData = [];

    for (let yr = 1; yr <= totalYears; yr++) {
      let yearlyInvested = 0;
      for (let m = 1; m <= 12; m++) {
        yearlyInvested += currentMonthlySIP;
        // Monthly compounding: FV = (Current + SIP) * (1 + r/12)
        currentWealth = (currentWealth + currentMonthlySIP) * (1 + r / 12);
      }
      totalInvested += yearlyInvested;

      yearByYearData.push({
        year: yr,
        invested: Math.round(totalInvested),
        wealth: Math.round(currentWealth),
        monthlySIP: Math.round(currentMonthlySIP)
      });

      // Increase SIP monthly amount by stepUp % for next year
      currentMonthlySIP = currentMonthlySIP * (1 + stepUp);
    }

    const wealthGain = currentWealth - totalInvested;

    return {
      invested: Math.round(totalInvested),
      wealth: Math.round(currentWealth),
      gain: Math.round(wealthGain),
      yearlyData: yearByYearData
    };
  };

  // 2. FD vs SIP vs SAVINGS COMPARISON
  const calculateComparison = () => {
    const P = parseFloat(amount);
    const n = parseInt(years) * 12;
    
    // Savings at 3%
    const iSave = 3 / 12 / 100;
    const valSave = P * ((Math.pow(1 + iSave, n) - 1) / iSave) * (1 + iSave);
    
    // FD at 6.5%
    const iFD = 6.5 / 12 / 100;
    const valFD = P * ((Math.pow(1 + iFD, n) - 1) / iFD) * (1 + iFD);

    // SIP at 12%
    const iSIP = 12 / 12 / 100;
    const valSIP = P * ((Math.pow(1 + iSIP, n) - 1) / iSIP) * (1 + iSIP);

    const invested = P * n;

    return {
      invested: Math.round(invested),
      savings: Math.round(valSave),
      fd: Math.round(valFD),
      sip: Math.round(valSIP)
    };
  };

  // 3. REAL INFLATION & PURCHASING POWER EROSION
  const calculateInflationDetails = () => {
    const PV = parseFloat(amount);
    const rate = parseFloat(inflationRate) / 100;

    const horizons = [10, 20, 30];
    const erosionResults = horizons.map(h => {
      const requiredFuture = PV * Math.pow(1 + rate, h);
      const remainingPower = 100000 / Math.pow(1 + rate, h); // How ₹1 Lakh shrinks
      return {
        horizon: h,
        requiredFuture: Math.round(requiredFuture),
        remainingPower: Math.round(remainingPower),
        lossPct: Math.round((1 - 1 / Math.pow(1 + rate, h)) * 100)
      };
    });

    return {
      currentExpense: PV,
      ratePct: inflationRate,
      horizons: erosionResults
    };
  };

  // RENDER 1: STEP-UP SIP & COMPOUND INTEREST VISUALIZER
  if (type === 'sip' || type === 'stepup_sip') {
    const data = calculateStepUpSIP();
    const total = data.wealth;
    const investedPct = Math.min(100, (data.invested / total) * 100);
    const gainPct = Math.max(0, 100 - investedPct);

    // Max value for bar chart height scaling
    const maxBarWealth = data.yearlyData.length > 0 ? data.yearlyData[data.yearlyData.length - 1].wealth : 1;

    return (
      <div style={{
        backgroundColor: '#121729',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Header Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#8B7FFF', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '800' }}>
              {getTxt("STEP-UP SIP WEALTH ACCUMULATOR", "स्टेप-अप SIP धन संचायक सिम्युलेटर")}
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF', margin: '4px 0 0', fontFamily: 'Sora, sans-serif' }}>
              {getTxt("Step-Up SIP & Compounding Engine", "स्टेप-अप SIP और कंपाउंडिंग इंजन")}
            </h3>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(139, 127, 255, 0.12)',
            border: '1px solid rgba(139, 127, 255, 0.3)',
            borderRadius: '20px',
            padding: '4px 12px',
            color: '#A594FF',
            fontSize: '0.75rem',
            fontWeight: '700'
          }}>
            <Sparkles size={13} />
            <span>{getTxt("Step-Up Active", "स्टेप-अप सक्रिय")}</span>
          </div>
        </div>

        {/* Input Sliders & Controls Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          
          {/* Monthly SIP Input */}
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.82rem', color: '#8E9BAE', fontWeight: '700' }}>
                {getTxt("Initial Monthly SIP:", "प्रारंभिक मासिक SIP:")}
              </label>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#FFFFFF' }}>{formatCurrency(amount)}</span>
            </div>
            <input 
              type="range"
              min="500"
              max="100000"
              step="500"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#8B7FFF' }}
            />
          </div>

          {/* Investment Duration */}
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.82rem', color: '#8E9BAE', fontWeight: '700' }}>
                {getTxt("Duration (Years):", "समय अवधि (वर्ष):")}
              </label>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#FFFFFF' }}>{years} {getTxt("Years", "वर्ष")}</span>
            </div>
            <input 
              type="range"
              min="1"
              max="30"
              value={years}
              onChange={(e) => setYears(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#2CD9C5' }}
            />
          </div>

          {/* Expected Annual Return Rate */}
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.82rem', color: '#8E9BAE', fontWeight: '700' }}>
                {getTxt("Expected Return (% p.a):", "अपेक्षित वार्षिक रिटर्न (%):")}
              </label>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#2CD9C5' }}>{returnRate}%</span>
            </div>
            <input 
              type="range"
              min="6"
              max="20"
              step="0.5"
              value={returnRate}
              onChange={(e) => setReturnRate(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#2CD9C5' }}
            />
          </div>

          {/* Annual Step-Up Percentage Slider */}
          <div style={{ backgroundColor: 'rgba(139, 127, 255, 0.06)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(139, 127, 255, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.82rem', color: '#A594FF', fontWeight: '800' }}>
                🚀 {getTxt("Annual Step-Up (%):", "वार्षिक स्टेप-अप (%):")}
              </label>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#A594FF' }}>+{stepUpPct}% / yr</span>
            </div>
            <input 
              type="range"
              min="0"
              max="25"
              step="1"
              value={stepUpPct}
              onChange={(e) => setStepUpPct(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#8B7FFF' }}
            />
          </div>

        </div>

        {/* Telemetry Results Display Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          padding: '20px',
          borderRadius: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#8E9BAE', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
              {getTxt("Total Capital Invested", "कुल निवेशित मूलधन")}
            </span>
            <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#FFFFFF', marginTop: '4px', fontFamily: 'Sora, sans-serif' }}>
              {formatCurrency(data.invested)}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#33D090', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
              {getTxt("Compounded Wealth Gain", "कंपाउंडिंग से बना लाभ")}
            </span>
            <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#33D090', marginTop: '4px', fontFamily: 'Sora, sans-serif' }}>
              + {formatCurrency(data.gain)}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#8B7FFF', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
              {getTxt("Total Future Corpus", "कुल भावी संचित धन")}
            </span>
            <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#8B7FFF', marginTop: '4px', fontFamily: 'Sora, sans-serif' }}>
              {formatCurrency(data.wealth)}
            </div>
          </div>
        </div>

        {/* YEAR-BY-YEAR VISUAL ACCUMULATION GRAPH */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: '#8E9BAE', fontWeight: '700' }}>
              📊 {getTxt("Year-by-Year Wealth Growth Curve", "वर्ष-दर-वर्ष धन वृद्धि वक्र")}
            </span>
            <span style={{ fontSize: '0.74rem', color: '#2CD9C5', fontWeight: '700' }}>
              {getTxt(`Step-up: +${stepUpPct}% per year`, `स्टेप-अप: +${stepUpPct}% प्रति वर्ष`)}
            </span>
          </div>

          {/* Bar Chart Container */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '6px',
            height: '140px',
            padding: '12px 10px 0 10px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            overflowX: 'auto'
          }}>
            {data.yearlyData.map((item, idx) => {
              const barHeightPct = Math.max(8, Math.round((item.wealth / maxBarWealth) * 100));
              const investedHeightPct = Math.max(4, Math.round((item.invested / item.wealth) * barHeightPct));

              return (
                <div 
                  key={item.year}
                  style={{
                    flex: 1,
                    minWidth: '18px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title={`Year ${item.year}: Wealth = ${formatCurrency(item.wealth)} | Invested = ${formatCurrency(item.invested)} | Monthly SIP = ${formatCurrency(item.monthlySIP)}`}
                >
                  <div style={{
                    width: '100%',
                    height: `${barHeightPct}%`,
                    borderRadius: '4px 4px 0 0',
                    background: 'linear-gradient(180deg, #8B7FFF 0%, #2CD9C5 100%)',
                    position: 'relative',
                    transition: 'height 0.4s ease'
                  }}>
                    {/* Invested portion overlay */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: `${(item.invested / item.wealth) * 100}%`,
                      backgroundColor: 'rgba(10, 15, 30, 0.65)',
                      borderRadius: '0 0 4px 4px'
                    }} />
                  </div>
                  {idx % Math.ceil(data.yearlyData.length / 6) === 0 && (
                    <span style={{ fontSize: '0.62rem', color: '#8E9BAE', fontWeight: '700' }}>Y{item.year}</span>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '20px', fontSize: '0.76rem', marginTop: '10px', color: '#8E9BAE' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: '#2CD9C5', borderRadius: '2px' }} />
              {getTxt("Compounded Wealth Gain", "कंपाउंडिंग से प्राप्त लाभ")}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: '#0F1528', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '2px' }} />
              {getTxt("Invested Principal Capital", "मूल निवेशित राशि")}
            </span>
          </div>
        </div>

      </div>
    );
  }

  // RENDER 2: FD vs SIP vs SAVINGS COMPARISON
  if (type === 'comparison') {
    const data = calculateComparison();
    const maxVal = Math.max(data.savings, data.fd, data.sip, 1);

    return (
      <div style={{
        backgroundColor: '#121729',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: '#2CD9C5', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '800' }}>
            {getTxt("ACCUMULATION PATH COMPARISON", "निवेश माध्यम तुलना सिम्युलेटर")}
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF', margin: '4px 0 0', fontFamily: 'Sora, sans-serif' }}>
            {getTxt("Savings vs FD vs Equity Mutual Fund SIP", "बचत खाता vs फिक्स्ड डिपॉजिट vs इक्विटी SIP")}
          </h3>
        </div>

        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.82rem', color: '#8E9BAE', fontWeight: '700' }}>
                {getTxt("Monthly Savings:", "मासिक बचत:")}
              </label>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#FFFFFF' }}>{formatCurrency(amount)}</span>
            </div>
            <input 
              type="range"
              min="1000"
              max="50000"
              step="1000"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#2CD9C5' }}
            />
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.82rem', color: '#8E9BAE', fontWeight: '700' }}>
                {getTxt("Time Horizon:", "अवधि:")}
              </label>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#FFFFFF' }}>{years} {getTxt("Years", "वर्ष")}</span>
            </div>
            <input 
              type="range"
              min="3"
              max="25"
              value={years}
              onChange={(e) => setYears(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#8B7FFF' }}
            />
          </div>
        </div>

        {/* Visual Bar Comparison Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Row 1: Savings Account */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span style={{ color: '#8E9BAE', fontWeight: '700' }}>🏦 {getTxt("Savings Account (3% Return)", "बचत खाता (३% रिटर्न)")}</span>
              <strong style={{ color: '#FFFFFF' }}>{formatCurrency(data.savings)}</strong>
            </div>
            <div style={{ height: '14px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(data.savings / maxVal) * 100}%`, backgroundColor: '#5A687D', transition: 'width 0.4s ease' }} />
            </div>
          </div>

          {/* Row 2: Fixed Deposit */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span style={{ color: '#FB923C', fontWeight: '700' }}>📜 {getTxt("Fixed Deposit (6.5% Return)", "फिक्स्ड डिपॉजिट (६.५% रिटर्न)")}</span>
              <strong style={{ color: '#FB923C' }}>{formatCurrency(data.fd)}</strong>
            </div>
            <div style={{ height: '14px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(data.fd / maxVal) * 100}%`, backgroundColor: '#FB923C', transition: 'width 0.4s ease' }} />
            </div>
          </div>

          {/* Row 3: Equity SIP */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span style={{ color: '#33D090', fontWeight: '800' }}>📈 {getTxt("Equity Mutual Fund SIP (12% Return)", "इक्विटी म्यूचुअल फंड SIP (१२% रिटर्न)")}</span>
              <strong style={{ color: '#33D090', fontSize: '1rem' }}>{formatCurrency(data.sip)}</strong>
            </div>
            <div style={{ height: '14px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(data.sip / maxVal) * 100}%`, background: 'linear-gradient(90deg, #8B7FFF, #33D090)', transition: 'width 0.4s ease' }} />
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px', fontSize: '0.82rem', color: '#8E9BAE', textAlign: 'center' }}>
            {getTxt("Total Invested Principal", "कुल निवेशित मूलधन")}: <strong style={{ color: '#FFFFFF' }}>{formatCurrency(data.invested)}</strong>
          </div>
        </div>
      </div>
    );
  }

  // RENDER 3: REAL INFLATION & PURCHASING POWER EROSION
  if (type === 'inflation') {
    const details = calculateInflationDetails();

    return (
      <div style={{
        backgroundColor: '#121729',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '800' }}>
            {getTxt("PURCHASING POWER EROSION", "मुद्रास्फीति (Inflation) क्षरण कैलकुलेटर")}
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF', margin: '4px 0 0', fontFamily: 'Sora, sans-serif' }}>
            {getTxt("Real Inflation & Purchasing Power Shrinkage", "वास्तविक महंगाई और क्रय शक्ति का क्षरण")}
          </h3>
        </div>

        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.82rem', color: '#8E9BAE', fontWeight: '700' }}>
                {getTxt("Monthly Expenses Today:", "आज का मासिक घरेलू खर्च:")}
              </label>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#FFFFFF' }}>{formatCurrency(amount)}</span>
            </div>
            <input 
              type="range"
              min="5000"
              max="200000"
              step="5000"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#f87171' }}
            />
          </div>

          <div style={{ backgroundColor: 'rgba(248, 113, 113, 0.06)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(248, 113, 113, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.82rem', color: '#f87171', fontWeight: '800' }}>
                🔥 {getTxt("Inflation Rate (%):", "महंगाई दर (%):")}
              </label>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#f87171' }}>{inflationRate}% / yr</span>
            </div>
            <input 
              type="range"
              min="4"
              max="12"
              step="0.5"
              value={inflationRate}
              onChange={(e) => setInflationRate(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#f87171' }}
            />
          </div>
        </div>

        {/* Multi-Horizon Comparison Grid (10, 20, 30 Years) */}
        <div>
          <span style={{ fontSize: '0.82rem', color: '#8E9BAE', fontWeight: '700', display: 'block', marginBottom: '12px' }}>
            📉 {getTxt("Future Monthly Expense Requirement vs. ₹1 Lakh Shrinkage Timeline", "भविष्य का मासिक खर्च आवश्यकता बनाम ₹१ लाख का क्षरण समय-सीमा")}
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {details.horizons.map(h => (
              <div key={h.horizon} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(248, 113, 113, 0.2)',
                borderRadius: '16px',
                padding: '18px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#f87171', fontWeight: '800', textTransform: 'uppercase' }}>
                    In {h.horizon} Years ({h.horizon * 12}m)
                  </span>
                  <span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(248, 113, 113, 0.15)', color: '#f87171', padding: '2px 8px', borderRadius: '8px', fontWeight: '800' }}>
                    -{h.lossPct}% Value
                  </span>
                </div>

                <div style={{ fontSize: '0.72rem', color: '#8E9BAE', marginBottom: '2px' }}>
                  {getTxt("Required Future Monthly Expenses:", "आवश्यक भावी मासिक खर्च:")}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '12px', fontFamily: 'Sora, sans-serif' }}>
                  {formatCurrency(h.requiredFuture)}
                </div>

                <div style={{ fontSize: '0.72rem', color: '#8E9BAE', marginBottom: '2px' }}>
                  {getTxt("Real Value of ₹1,00,000 Cash:", "₹१,००,००० नकद का वास्तविक मूल्य:")}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FB923C', fontFamily: 'Sora, sans-serif' }}>
                  {formatCurrency(h.remainingPower)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // RENDER 4: LTCG & STCG TAX OPTIMIZER (BUDGET 2024 ENFORCED)
  if (type === 'tax') {
    const [buyPrice, setBuyPrice] = useState(250);
    const [sellPrice, setSellPrice] = useState(450);
    const [qty, setQty] = useState(1000);
    const [buyDate, setBuyDate] = useState('2024-04-01');
    const [sellDate, setSellDate] = useState('2026-07-01');

    const d1 = new Date(buyDate);
    const d2 = new Date(sellDate);
    const diffTime = Math.max(0, d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const holdingMonths = Math.max(0, Math.floor(diffDays / 30.43));

    const isLTCG = holdingMonths >= 12;
    const totalBuy = buyPrice * qty;
    const totalSell = sellPrice * qty;
    const gain = totalSell - totalBuy;
    const isProfit = gain > 0;

    // Budget 2024 Rules:
    // LTCG: 12.5% on gains above ₹1,25,000 exemption
    // STCG: 20% flat tax on entire profit
    let taxableGain = 0;
    let taxAmt = 0;
    let taxRate = 0;

    if (isProfit) {
      if (isLTCG) {
        taxRate = 12.5;
        taxableGain = Math.max(0, gain - 125000);
        taxAmt = taxableGain * 0.125;
      } else {
        taxRate = 20;
        taxableGain = gain;
        taxAmt = gain * 0.20;
      }
    }

    const netProfit = isProfit ? gain - taxAmt : gain;

    // Visual chart percentages
    const exitVal = Math.max(totalBuy, totalSell, 1);
    const buyPct = Math.round((totalBuy / exitVal) * 100);
    const taxPct = isProfit ? Math.round((taxAmt / exitVal) * 100) : 0;
    const profitPct = isProfit ? Math.round((netProfit / exitVal) * 100) : 0;

    // Calculate tax savings if user held <12 months but switches to LTCG
    const stcgTax = gain * 0.20;
    const ltcgTax = Math.max(0, gain - 125000) * 0.125;
    const potentialTaxSaved = Math.max(0, stcgTax - ltcgTax);

    return (
      <div style={{
        backgroundColor: '#121729',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#F0B84A', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '800' }}>
              {getTxt("UNION BUDGET 2024 REVISED RULES", "केंद्रीय बजट २०२४ नियम")}
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF', margin: '4px 0 0', fontFamily: 'Sora, sans-serif' }}>
              {getTxt("LTCG / STCG Capital Gains Tax Optimizer", "LTCG / STCG पूंजीगत लाभ कर ऑप्टिमाइज़र")}
            </h3>
          </div>

          <span style={{
            fontSize: '0.72rem',
            color: '#F0B84A',
            backgroundColor: 'rgba(240, 184, 74, 0.12)',
            border: '1px solid rgba(240, 184, 74, 0.3)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontWeight: '800'
          }}>
            ₹1.25L Annual Exemption Enforced
          </span>
        </div>

        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#8E9BAE', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
              {getTxt('Buy Price (₹/share)', 'खरीद मूल्य (₹/शेयर)')}
            </label>
            <input
              type="number"
              value={buyPrice}
              min="1"
              onChange={e => setBuyPrice(Math.max(1, parseFloat(e.target.value) || 1))}
              style={{
                width: '100%', backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
                color: '#FFFFFF', padding: '10px 14px', fontSize: '0.9rem', outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#8E9BAE', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
              {getTxt('Sell Price (₹/share)', 'बिक्री मूल्य (₹/शेयर)')}
            </label>
            <input
              type="number"
              value={sellPrice}
              min="1"
              onChange={e => setSellPrice(Math.max(1, parseFloat(e.target.value) || 1))}
              style={{
                width: '100%', backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
                color: '#FFFFFF', padding: '10px 14px', fontSize: '0.9rem', outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#8E9BAE', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
              {getTxt('Quantity (shares)', 'मात्रा (शेयर)')}
            </label>
            <input
              type="number"
              value={qty}
              min="1"
              onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              style={{
                width: '100%', backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
                color: '#FFFFFF', padding: '10px 14px', fontSize: '0.9rem', outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#8E9BAE', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
              {getTxt('Buy Date', 'खरीद की तारीख')}
            </label>
            <input
              type="date"
              value={buyDate}
              onChange={e => setBuyDate(e.target.value)}
              style={{
                width: '100%', backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
                color: '#FFFFFF', padding: '9px 12px', fontSize: '0.85rem', outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#8E9BAE', display: 'block', marginBottom: '4px', fontWeight: '700' }}>
              {getTxt('Sell Date', 'बिक्री की तारीख')}
            </label>
            <input
              type="date"
              value={sellDate}
              onChange={e => setSellDate(e.target.value)}
              style={{
                width: '100%', backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
                color: '#FFFFFF', padding: '9px 12px', fontSize: '0.85rem', outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Classification Badge & Tax Rate Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{
            padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800',
            background: isLTCG ? 'rgba(51, 208, 144, 0.15)' : 'rgba(251, 146, 60, 0.15)',
            border: `1px solid ${isLTCG ? 'rgba(51, 208, 144, 0.4)' : 'rgba(251, 146, 60, 0.4)'}`,
            color: isLTCG ? '#33D090' : '#FB923C',
          }}>
            {isLTCG
              ? getTxt('✅ LTCG — Long Term (>12 months)', '✅ LTCG — दीर्घकालिक (>12 महीने)')
              : getTxt('⚡ STCG — Short Term (<12 months)', '⚡ STCG — अल्पकालिक (<12 महीने)')}
          </span>
          <span style={{ fontSize: '0.82rem', color: '#8E9BAE' }}>
            {getTxt(`Holding period: ${diffDays} days (~${holdingMonths} months)`, `होल्डिंग अवधि: ${diffDays} दिन (~${holdingMonths} महीने)`)}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: '700' }}>
            {getTxt(`Tax Rate: ${taxRate}%`, `कर की दर: ${taxRate}%`)}
            {isLTCG && ' ' + getTxt('(₹1.25L exempt)', '(₹1.25L छूट)')}
          </span>
        </div>

        {/* Visual Portfolio Share Breakdown */}
        {isProfit && (
          <div>
            <span style={{ fontSize: '0.78rem', color: '#8E9BAE', display: 'block', marginBottom: '8px', fontWeight: '700' }}>
              {getTxt('Visual Portfolio Exit Share Breakdown:', 'पोर्टफोलियो निष्कासन शेयर ब्रेकडाउन:')}
            </span>
            <div style={{
              display: 'flex',
              height: '20px',
              width: '100%',
              borderRadius: '6px',
              overflow: 'hidden',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '10px'
            }}>
              <div style={{ width: `${buyPct}%`, backgroundColor: '#3b82f6', transition: 'width 0.3s ease' }} title={`Invested: ${buyPct}%`} />
              <div style={{ width: `${profitPct}%`, backgroundColor: '#8B7FFF', transition: 'width 0.3s ease' }} title={`Net Profit: ${profitPct}%`} />
              <div style={{ width: `${taxPct}%`, backgroundColor: '#f87171', transition: 'width 0.3s ease' }} title={`Tax: ${taxPct}%`} />
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.76rem', color: '#8E9BAE' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '2px' }} />
                {getTxt(`Invested Capital (${buyPct}%)`, `निवेशित पूंजी (${buyPct}%)`)}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: '#8B7FFF', borderRadius: '2px' }} />
                {getTxt(`Net Profit (${profitPct}%)`, `शुद्ध लाभ (${profitPct}%)`)}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: '#f87171', borderRadius: '2px' }} />
                {getTxt(`Tax Liability (${taxPct}%)`, `कर देयता (${taxPct}%)`)}
              </span>
            </div>
          </div>
        )}

        {/* Results Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
          {[
            { label: getTxt('Total Invested', 'कुल निवेश'), val: formatCurrency(totalBuy), color: '#FFFFFF' },
            { label: getTxt('Total Sale Value', 'कुल बिक्री मूल्य'), val: formatCurrency(totalSell), color: '#FFFFFF' },
            { label: getTxt('Capital Gain', 'पूंजीगत लाभ'), val: formatCurrency(gain), color: isProfit ? '#33D090' : '#f87171' },
            { label: getTxt('Taxable Gain', 'कर योग्य लाभ'), val: formatCurrency(taxableGain), color: '#F0B84A' },
            { label: getTxt('Tax Liability', 'कर देयता'), val: formatCurrency(taxAmt), color: '#f87171' },
            { label: getTxt('Net Profit (after tax)', 'शुद्ध लाभ (कर के बाद)'), val: formatCurrency(netProfit), color: '#8B7FFF' },
          ].map(({ label, val, color }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.02)', borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.06)', padding: '14px',
            }}>
              <div style={{ fontSize: '0.72rem', color: '#8E9BAE', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', color, fontFamily: 'Sora, sans-serif' }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Tax Optimizer Saver Tip Card */}
        {!isLTCG && potentialTaxSaved > 0 && (
          <div style={{
            padding: '14px 18px',
            borderRadius: '12px',
            backgroundColor: 'rgba(51, 208, 144, 0.08)',
            border: '1px solid rgba(51, 208, 144, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Sparkles size={20} color="#33D090" />
            <div>
              <h5 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#33D090', margin: 0 }}>
                💡 {getTxt(`Tax Optimization Opportunity: Save ${formatCurrency(potentialTaxSaved)}`, `कर बचत का अवसर: ${formatCurrency(potentialTaxSaved)} बचाएं`)}
              </h5>
              <p style={{ fontSize: '0.78rem', color: '#8E9BAE', margin: '2px 0 0' }}>
                {getTxt(
                  `Holding this investment for ${12 - holdingMonths} more months switches your tax rate from 20% (STCG) to 12.5% (LTCG with ₹1.25L exemption).`,
                  `इस निवेश को ${12 - holdingMonths} और महीनों तक रखने से आपकी कर दर 20% (STCG) से घटकर 12.5% (LTCG) हो जाएगी।`
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // RENDER: FIRE CALCULATOR
  if (type === 'fire') {
    const data = calculateFIRE();
    
    // Determine chart data points (every 5 years + achieved age)
    const chartData = data.yearlyData.filter(d => (d.age % 5 === 0) || d.age === data.achievedAge).slice(0, 10);
    const maxCorpus = chartData.length > 0 ? Math.max(...chartData.map(d => Math.max(d.corpus, d.target))) : 1;

    return (
      <div style={{
        backgroundColor: '#121729',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Header Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '800' }}>
              {getTxt("FIRE RETIREMENT SIMULATOR", "FIRE सेवानिवृत्ति सिम्युलेटर")}
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF', margin: '4px 0 0', fontFamily: 'Sora, sans-serif' }}>
              {getTxt("Financial Independence, Retire Early", "वित्तीय स्वतंत्रता, शीघ्र सेवानिवृत्ति (FIRE)")}
            </h3>
          </div>

          {data.achievedAge && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(248, 113, 113, 0.12)',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              borderRadius: '20px',
              padding: '4px 12px',
              color: '#f87171',
              fontSize: '0.75rem',
              fontWeight: '700'
            }}>
              <Flame size={13} />
              <span>{getTxt(`FIRE at Age ${data.achievedAge}`, `आयु ${data.achievedAge} में FIRE`)}</span>
            </div>
          )}
        </div>

        {/* Input Sliders & Controls Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.82rem', color: '#8E9BAE', fontWeight: '700' }}>{getTxt("Current Age:", "वर्तमान आयु:")}</label>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#FFFFFF' }}>{currentAge}</span>
            </div>
            <input type="range" min="18" max="55" value={currentAge} onChange={(e) => setCurrentAge(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#f87171' }} />
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.82rem', color: '#8E9BAE', fontWeight: '700' }}>{getTxt("Monthly Expenses:", "मासिक खर्च:")}</label>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#FFFFFF' }}>{formatCurrency(monthlyExpense)}</span>
            </div>
            <input type="range" min="10000" max="200000" step="5000" value={monthlyExpense} onChange={(e) => setMonthlyExpense(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#f87171' }} />
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.82rem', color: '#8E9BAE', fontWeight: '700' }}>{getTxt("Monthly SIP:", "मासिक SIP (निवेश):")}</label>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#FFFFFF' }}>{formatCurrency(amount)}</span>
            </div>
            <input type="range" min="5000" max="500000" step="5000" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#33D090' }} />
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.82rem', color: '#8E9BAE', fontWeight: '700' }}>{getTxt("Expected Return:", "अपेक्षित रिटर्न:")}</label>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#FFFFFF' }}>{returnRate}%</span>
            </div>
            <input type="range" min="6" max="20" step="0.5" value={returnRate} onChange={(e) => setReturnRate(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#33D090' }} />
          </div>
        </div>

        {/* Visual Line Graph (Approximated with HTML bars) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', paddingBottom: '10px', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
            {chartData.map((item, idx) => {
              const corpusHeight = Math.max(2, (item.corpus / maxCorpus) * 100);
              const targetHeight = Math.max(2, (item.target / maxCorpus) * 100);
              const isAchieved = item.age === data.achievedAge;

              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '32px' }}>
                  <div style={{ position: 'relative', width: '20px', height: '120px' }}>
                    {/* Corpus Bar */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, width: '10px', height: `${corpusHeight}%`,
                      backgroundColor: isAchieved ? '#f87171' : '#33D090',
                      borderRadius: '3px 3px 0 0', transition: 'height 0.3s ease'
                    }} title={`Age ${item.age} Corpus: ${formatCurrency(item.corpus)}`} />
                    
                    {/* Target Line marker */}
                    <div style={{
                      position: 'absolute', bottom: `${targetHeight}%`, left: '-5px', width: '30px', height: '2px',
                      backgroundColor: '#8FA0B5', zIndex: 2
                    }} title={`FIRE Target: ${formatCurrency(item.target)}`} />
                  </div>
                  <span style={{ fontSize: '0.62rem', color: isAchieved ? '#f87171' : '#8E9BAE', fontWeight: isAchieved ? 'bold' : 'normal' }}>
                    {isAchieved ? `🔥 ${item.age}` : `Age ${item.age}`}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.76rem', marginTop: '10px', color: '#8E9BAE', justifyContent: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: '#33D090', borderRadius: '2px' }} />
              {getTxt("Accumulated Corpus", "संचित धन")}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '16px', height: '2px', backgroundColor: '#8FA0B5' }} />
              {getTxt("FIRE Target (25x Expenses)", "FIRE लक्ष्य (25x खर्च)")}
            </span>
          </div>
        </div>

        {/* Results Info */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', padding: '14px' }}>
            <div style={{ fontSize: '0.72rem', color: '#8E9BAE', marginBottom: '4px' }}>{getTxt('Retirement Age', 'सेवानिवृत्ति आयु')}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#f87171', fontFamily: 'Sora, sans-serif' }}>
              {data.achievedAge ? data.achievedAge : getTxt("Beyond 85", "85+ वर्ष")}
            </div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', padding: '14px' }}>
            <div style={{ fontSize: '0.72rem', color: '#8E9BAE', marginBottom: '4px' }}>{getTxt('Target Corpus Needed', 'लक्षित कॉर्पस')}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#33D090', fontFamily: 'Sora, sans-serif' }}>
              {data.fireTargetAtAchieved ? formatCurrency(data.fireTargetAtAchieved) : '-'}
            </div>
          </div>
        </div>

      </div>
    );
  }

  return null;
}
