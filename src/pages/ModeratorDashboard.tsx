import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Loader2, AlertTriangle, Check, X } from 'lucide-react';

import type { RootState, AppDispatch } from '../store/store';
import { 
  fetchLangCalculations, 
  processCalculationByModerator 
} from '../store/langCalculationsSlice';

import styles from './ModeratorDashboard.module.css';

export const ModeratorDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: calculations, status, error } = useSelector((state: RootState) => state.langCalculations);

  // Состояния фильтров
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterFamily, setFilterFamily] = useState<string>(''); 
  const [filterResearcherId, setFilterResearcherId] = useState<string>('');
  
  // Фильтры по дате (теперь используем dateUpdate)
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');

  useEffect(() => {
    dispatch(fetchLangCalculations());
  }, [dispatch]);

  // Универсальный обработчик для модератора
  const handleModeratorAction = (id: number, action: 'завершить' | 'отклонить') => {
    const actionText = action === 'завершить' ? 'одобрить и рассчитать' : 'отклонить';
    if (confirm(`Вы уверены, что хотите ${actionText} заявку #${id}?`)) {
      dispatch(processCalculationByModerator({ id, action }));
    }
  };

  // Клиентская фильтрация полученных данных
  const filteredCalculations = useMemo(() => {
    return calculations.filter((calc) => {
      // 1. Фильтр по статусу
      if (filterStatus && calc.status !== filterStatus) return false;
      
      // 2. Фильтр по ID создателя
      if (filterResearcherId && calc.researcherID !== undefined) {
        if (!calc.researcherID.toString().includes(filterResearcherId)) return false;
      }

      // 3. Фильтр по языковой семье
      if (filterFamily && calc.languages) {
        const hasFamily = calc.languages.some(l => 
          l.language?.family?.toLowerCase().includes(filterFamily.toLowerCase())
        );
        if (!hasFamily) return false;
      }

      // 4. Фильтр по ДИАПАЗОНУ ДАТ (по dateUpdate)
      if (filterDateFrom || filterDateTo) {
        if (!calc.dateUpdate) {
            // Если фильтр задан, а у заявки нет даты обновления (например, старый черновик) — скрываем
            return false;
        }

        const calcDate = new Date(calc.dateUpdate).getTime();
        
        if (filterDateFrom) {
          const fromDate = new Date(filterDateFrom).getTime();
          if (calcDate < fromDate) return false;
        }
        
        if (filterDateTo) {
          // Добавляем 1 день (86400000 мс), чтобы включить весь выбранный день до 23:59:59
          const toDate = new Date(filterDateTo).getTime() + 86400000;
          if (calcDate >= toDate) return false;
        }
      }

      return true;
    });
  }, [calculations, filterStatus, filterResearcherId, filterFamily, filterDateFrom, filterDateTo]);

  const clearDateFilter = () => {
    setFilterDateFrom('');
    setFilterDateTo('');
  };


  if (status === 'loading' && calculations.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen text-foreground">
        <Loader2 className="animate-spin mr-2" /> Загрузка панели управления...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-destructive">
        <AlertTriangle className="mx-auto mb-2" />
        Ошибка доступа: {typeof error === 'object' ? JSON.stringify(error) : error}
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.pageTitle}>Панель Модератора</h1>

      {/* --- Блок Фильтрации --- */}
      <section className={styles.filtersSection}>
        
        {/* Статус */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Статус заявки</label>
          <select 
            className={styles.filterSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Все статусы</option>
            <option value="сформирован">Сформированы (Ожидают)</option>
            <option value="черновик">Черновики</option>
            <option value="завершён">Завершены</option>
            <option value="отклонён">Отклонены</option>
          </select>
        </div>

        {/* Языковая семья */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Языковая семья</label>
          <input 
            type="text" 
            className={styles.filterInput}
            placeholder="Например, Индоевропейская"
            value={filterFamily}
            onChange={(e) => setFilterFamily(e.target.value)}
          />
        </div>

        {/* ID Создателя */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>ID Создателя</label>
          <input 
            type="number" 
            className={styles.filterInput}
            placeholder="Поиск по ID"
            value={filterResearcherId}
            onChange={(e) => setFilterResearcherId(e.target.value)}
          />
        </div>

        {/* Диапазон дат ОТ (dateUpdate) */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Дата формирования (От)</label>
          <input 
            type="date" 
            className={styles.filterInput}
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
          />
        </div>

        {/* Диапазон дат ДО (dateUpdate) */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Дата формирования (До)</label>
          <div className="flex gap-2 w-full">
             <input 
               type="date" 
               className={styles.filterInput}
               style={{ flex: 1 }}
               value={filterDateTo}
               onChange={(e) => setFilterDateTo(e.target.value)}
             />
             {(filterDateFrom || filterDateTo) && (
               <button 
                  className={styles.btnReject} 
                  onClick={clearDateFilter}
                  title="Сбросить даты"
                  style={{ padding: '0 0.5rem', fontWeight: 'bold' }}
               >
                  <X size={16} />
               </button>
             )}
          </div>
        </div>

      </section>

      {/* --- Таблица Заявок --- */}
      <section className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>ID</th>
              <th className={styles.th}>Даты (Обновление)</th>
              <th className={styles.th}>Статус</th>
              <th className={styles.th}>Выборка</th>
              <th className={styles.th}>Результат дивергенции</th>
              <th className={styles.th}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredCalculations.map((calc) => {
              
              let statusClass = styles.draft;
              if (calc.status === 'сформирован') statusClass = styles.formed;
              if (calc.status === 'завершён') statusClass = styles.completed;
              if (calc.status === 'отклонён') statusClass = styles.rejected;

              return (
                <tr key={calc.id} className={styles.tr}>
                  <td className={styles.td}>
                    <Link to={`/lang-calculation/${calc.id}`} className={styles.calcId}>
                      #{calc.id}
                    </Link>
                  </td>

                  {/* Изменено на вывод dateUpdate */}
                  <td className={styles.td}>
                    <div className={styles.metaInfo}>
                      <span className="font-bold text-foreground">
                        Создатель ID: {calc.researcherID !== undefined ? calc.researcherID : '—'}
                      </span>
                      {calc.dateUpdate ? (
                        <span>Обновлено: {new Date(calc.dateUpdate).toLocaleDateString('ru-RU')}</span>
                      ) : (
                        calc.dateCreate && <span>Создано: {new Date(calc.dateCreate).toLocaleDateString('ru-RU')}</span>
                      )}
                    </div>
                  </td>

                  <td className={styles.td}>
                    <span className={`${styles.statusBadge} ${statusClass}`}>
                      {calc.status}
                    </span>
                  </td>

                  <td className={styles.td}>
                    <div className={styles.metaInfo}>
                      <span>Всего: {calc.languages?.length || 0} яз.</span>
                      {calc.baseLanguageID !== undefined && calc.baseLanguageID !== 0 && (
                        <span className="text-accent font-bold">
                          ID Базового: {calc.baseLanguageID}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className={styles.td}>
                    {calc.status === 'завершён' ? (
                      <div className={styles.metaInfo}>
                        <span className={styles.resultValue}>
                          {calc.resultYearsAgo !== undefined ? calc.resultYearsAgo : '—'} лет
                        </span>
                        <span>
                          {calc.similarityRate !== undefined ? (calc.similarityRate * 100).toFixed(1) : 0}% схожести
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">
                        {calc.status === 'отклонён' ? 'Расчет отменен' : 'Ожидает расчета...'}
                      </span>
                    )}
                  </td>

                  <td className={styles.td}>
                    {calc.status === 'сформирован' && (
                      <div className={styles.actionButtons}>
                        <button 
                          className={`${styles.btn} ${styles.btnApprove}`}
                          onClick={() => handleModeratorAction(calc.id!, 'завершить')}
                          title="Одобрить и произвести расчет"
                        >
                          <Check size={14} className="inline mr-1" /> Одобрить
                        </button>
                        
                        <button 
                          className={`${styles.btn} ${styles.btnReject}`}
                          onClick={() => handleModeratorAction(calc.id!, 'отклонить')}
                          title="Отклонить заявку"
                        >
                          <X size={14} className="inline mr-1" /> Отклонить
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredCalculations.length === 0 && status === 'succeeded' && (
          <div className={styles.emptyState}>
            По заданным фильтрам заявок не найдено.
          </div>
        )}
      </section>

    </main>
  );
};
