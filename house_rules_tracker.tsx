import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, CheckCircle, XCircle, Users, Trash2, ShoppingCart, Droplet, Home, BarChart3, Clock, AlertCircle } from 'lucide-react';

const HouseRulesApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [dishes, setDishes] = useState({});
  const [sundayReset, setSundayReset] = useState({});
  const [totalFines, setTotalFines] = useState(0);
  const [weeklyHistory, setWeeklyHistory] = useState([]);
  const [currentWeek, setCurrentWeek] = useState('');

  const housemates = ['Shreyan', 'Biraj', 'Nhoojah', 'Sandarva', 'Prakash', 'Aaditya', 'Shreyak'];
  
  const roles = [
    { name: 'Fridge & Stock', person: 'Shreyan', icon: ShoppingCart, description: 'Dish soap refills, fridge basics, and grocery essentials list' },
    { name: 'Grocery Logistics', person: 'Biraj', icon: ShoppingCart, description: 'Handles weekly ordering and restocking' },
    { name: 'Trash Team', people: ['Nhoojah', 'Sandarva', 'Prakash'], icon: Trash2, description: 'All house trash, including bathrooms' },
    { name: 'Toilet Duty - 2nd Floor', person: 'Aaditya', icon: Droplet, description: '2nd Floor bathroom' },
    { name: 'Toilet Duty - Bottom Floor', person: 'Shreyak', icon: Droplet, description: 'Bottom Floor bathroom' }
  ];

  const getWeekIdentifier = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekNum = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${weekNum}`;
  };

  const getNextSunday = () => {
    const now = new Date();
    const day = now.getDay();
    const daysUntilSunday = day === 0 ? 7 : 7 - day;
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + daysUntilSunday);
    nextSunday.setHours(23, 59, 59, 999);
    return nextSunday;
  };

  const getDaysUntilSunday = () => {
    const now = new Date();
    const day = now.getDay();
    return day === 0 ? 7 : 7 - day;
  };

  useEffect(() => {
    const week = getWeekIdentifier();
    setCurrentWeek(week);
    
    const storedWeek = localStorage.getItem('currentWeek');
    
    if (storedWeek !== week) {
      // New week - save old data to history and reset
      const oldDishes = JSON.parse(localStorage.getItem('dishes') || '{}');
      const oldSunday = JSON.parse(localStorage.getItem('sundayReset') || '{}');
      const oldFines = parseInt(localStorage.getItem('totalFines') || '0', 10);
      
      if (storedWeek) {
        const history = JSON.parse(localStorage.getItem('weeklyHistory') || '[]');
        history.unshift({
          week: storedWeek,
          dishes: oldDishes,
          sundayReset: oldSunday,
          fines: oldFines,
          date: new Date().toISOString()
        });
        localStorage.setItem('weeklyHistory', JSON.stringify(history.slice(0, 12)));
      }
      
      // Reset for new week
      const resetDishes = {};
      const resetSunday = {};
      housemates.forEach(person => {
        resetDishes[person] = [];
        resetSunday[person] = false;
      });
      
      setDishes(resetDishes);
      setSundayReset(resetSunday);
      setTotalFines(oldFines); // Keep fines accumulated
      
      localStorage.setItem('dishes', JSON.stringify(resetDishes));
      localStorage.setItem('sundayReset', JSON.stringify(resetSunday));
      localStorage.setItem('currentWeek', week);
    } else {
      // Same week - load data
      const loadedDishes = JSON.parse(localStorage.getItem('dishes') || '{}');
      const loadedSunday = JSON.parse(localStorage.getItem('sundayReset') || '{}');
      const loadedFines = parseInt(localStorage.getItem('totalFines') || '0', 10);
      
      const initDishes = {};
      const initSunday = {};
      housemates.forEach(person => {
        initDishes[person] = loadedDishes[person] || [];
        initSunday[person] = loadedSunday[person] || false;
      });
      
      setDishes(initDishes);
      setSundayReset(initSunday);
      setTotalFines(loadedFines);
    }
    
    setWeeklyHistory(JSON.parse(localStorage.getItem('weeklyHistory') || '[]'));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (now.getDay() === 0 && now.getHours() === 0 && now.getMinutes() === 0) {
        window.location.reload();
      }
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const addDishViolation = (person) => {
    const newDishes = { ...dishes };
    const today = new Date().toLocaleDateString();
    newDishes[person] = [...(newDishes[person] || []), today];
    setDishes(newDishes);
    localStorage.setItem('dishes', JSON.stringify(newDishes));
    
    const newTotal = totalFines + 5;
    setTotalFines(newTotal);
    localStorage.setItem('totalFines', newTotal.toString());
  };

  const removeDishViolation = (person, index) => {
    const newDishes = { ...dishes };
    newDishes[person].splice(index, 1);
    setDishes(newDishes);
    localStorage.setItem('dishes', JSON.stringify(newDishes));
    
    const newTotal = Math.max(0, totalFines - 5);
    setTotalFines(newTotal);
    localStorage.setItem('totalFines', newTotal.toString());
  };

  const toggleSundayReset = (person) => {
    const newReset = { ...sundayReset, [person]: !sundayReset[person] };
    setSundayReset(newReset);
    localStorage.setItem('sundayReset', JSON.stringify(newReset));
  };

  const DashboardPage = () => {
    const daysUntilReset = getDaysUntilSunday();
    const totalViolations = Object.values(dishes).reduce((sum: number, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
    const sundayCompletions = Object.values(sundayReset).filter(Boolean).length;
    
    return (
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg">
            <DollarSign className="w-8 h-8 mb-2 opacity-80" />
            <div className="text-3xl font-bold">${totalFines}</div>
            <div className="text-sm opacity-90">Holiday Fund</div>
          </div>
          
          <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-xl p-6 shadow-lg">
            <AlertCircle className="w-8 h-8 mb-2 opacity-80" />
            <div className="text-3xl font-bold">{totalViolations}</div>
            <div className="text-sm opacity-90">Dish Violations</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl p-6 shadow-lg">
            <CheckCircle className="w-8 h-8 mb-2 opacity-80" />
            <div className="text-3xl font-bold">{sundayCompletions}/7</div>
            <div className="text-sm opacity-90">Sunday Cleanings</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-violet-600 text-white rounded-xl p-6 shadow-lg">
            <Clock className="w-8 h-8 mb-2 opacity-80" />
            <div className="text-3xl font-bold">{daysUntilReset}</div>
            <div className="text-sm opacity-90">Days Until Reset</div>
          </div>
        </div>

        {/* Quick Status */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">This Week's Status</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {housemates.map(person => {
              const violations = (dishes[person] || []).length;
              const completed = sundayReset[person];
              return (
                <div key={person} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">{person}</div>
                    <div className="text-sm text-gray-600">
                      {violations > 0 && <span className="text-red-600">{violations} violation{violations > 1 ? 's' : ''}</span>}
                      {violations === 0 && <span className="text-green-600">No violations</span>}
                    </div>
                  </div>
                  {completed ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rules Reference */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">House Rules</h3>
          <div className="space-y-3">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="font-semibold text-red-800">Rule A: Wash Your Own Dishes</div>
              <div className="text-sm text-gray-700 mt-1">$5 fine per missed wash</div>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="font-semibold text-blue-800">Rule B: Same Day Food Storage</div>
              <div className="text-sm text-gray-700 mt-1">Portion and store food the same day it's cooked</div>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
              <div className="font-semibold text-purple-800">Sunday Reset</div>
              <div className="text-sm text-gray-700 mt-1">Mandatory weekly cleaning for everyone</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DishTrackerPage = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dish Violation Tracker</h2>
        <div className="space-y-4">
          {housemates.map(person => (
            <div key={person} className="bg-gray-50 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-bold text-lg text-gray-800">{person}</span>
                  {dishes[person]?.length > 0 && (
                    <span className="ml-3 text-red-600 font-semibold">
                      {dishes[person].length} violation{dishes[person].length > 1 ? 's' : ''} (${dishes[person].length * 5})
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => addDishViolation(person)}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition"
                  >
                    Add Violation
                  </button>
                  {dishes[person]?.length > 0 && (
                    <button
                      onClick={() => removeDishViolation(person, dishes[person].length - 1)}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium transition"
                    >
                      Undo Last
                    </button>
                  )}
                </div>
              </div>
              {dishes[person]?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {dishes[person].map((date, idx) => (
                    <span key={idx} className="bg-white px-3 py-1 rounded-full text-sm text-gray-600 border border-gray-300">
                      {date}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SundayResetPage = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Sunday Reset Checklist</h2>
          <div className="text-right">
            <div className="text-sm text-gray-600">Completed</div>
            <div className="text-3xl font-bold text-indigo-600">
              {Object.values(sundayReset).filter(Boolean).length}/7
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {housemates.map(person => (
            <button
              key={person}
              onClick={() => toggleSundayReset(person)}
              className={`p-6 rounded-xl border-2 transition transform hover:scale-105 ${
                sundayReset[person]
                  ? 'bg-green-100 border-green-500'
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg text-gray-800">{person}</span>
                {sundayReset[person] ? (
                  <CheckCircle className="w-7 h-7 text-green-600" />
                ) : (
                  <XCircle className="w-7 h-7 text-gray-400" />
                )}
              </div>
              <div className="text-sm text-gray-600">
                {sundayReset[person] ? 'Completed ✓' : 'Pending'}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-purple-700 mb-2">Weekly Cleaning Tasks</h3>
        <p className="text-gray-700">Mandatory cleaning and organization for the entire house every Sunday.</p>
      </div>
    </div>
  );

  const RolesPage = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Specialized Roles</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {roles.map((role, idx) => (
            <div key={idx} className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-600 p-3 rounded-lg">
                  <role.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{role.name}</h3>
                  <p className="text-indigo-600 font-semibold mb-3">
                    {role.people ? role.people.join(', ') : role.person}
                  </p>
                  <p className="text-gray-600">{role.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const WeeklySummaryPage = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Weekly History</h2>
        {weeklyHistory.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No previous weeks recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {weeklyHistory.map((week, idx) => {
              const totalViolations = Object.values(week.dishes).reduce((sum: number, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
              const completedSunday = Object.values(week.sundayReset).filter(Boolean).length;
              
              return (
                <div key={idx} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Week {week.week}</h3>
                      <p className="text-sm text-gray-600">{new Date(week.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">${week.fines}</div>
                      <div className="text-sm text-gray-600">Total Fines</div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-2">Dish Violations ({totalViolations})</div>
                      <div className="space-y-1">
                        {Object.entries(week.dishes).map(([person, violations]) => {
                          const violationsArray = Array.isArray(violations) ? violations : [];
                          return violationsArray.length > 0 && (
                            <div key={person} className="text-sm text-gray-600">
                              {person}: {violationsArray.length} violation{violationsArray.length > 1 ? 's' : ''}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-2">Sunday Reset ({completedSunday}/7)</div>
                      <div className="space-y-1">
                        {Object.entries(week.sundayReset).map(([person, completed]) => (
                          <div key={person} className="text-sm">
                            <span className="text-gray-600">{person}: </span>
                            {completed ? (
                              <span className="text-green-600">✓ Completed</span>
                            ) : (
                              <span className="text-red-600">✗ Missed</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Home className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">House Manager</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-gray-600">Resets in</div>
                <div className="text-lg font-bold text-indigo-600">{getDaysUntilSunday()} days</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'dishes', label: 'Dish Tracker', icon: AlertCircle },
              { id: 'sunday', label: 'Sunday Reset', icon: Calendar },
              { id: 'roles', label: 'Roles', icon: Users },
              { id: 'summary', label: 'History', icon: BarChart3 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentPage(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition ${
                  currentPage === tab.id
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'dishes' && <DishTrackerPage />}
        {currentPage === 'sunday' && <SundayResetPage />}
        {currentPage === 'roles' && <RolesPage />}
        {currentPage === 'summary' && <WeeklySummaryPage />}
      </div>
    </div>
  );
};

export default HouseRulesApp;