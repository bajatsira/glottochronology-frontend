import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Loader2, AlertTriangle, ArrowRight, Trash2 } from 'lucide-react';

import { fetchLangCalculations, deleteCalculation } from '../store/langCalculationsSlice';
import type { RootState, AppDispatch } from '../store/store';

// Импортируем компонент дашборда
import { ModeratorDashboard } from './ModeratorDashboard';
import styles from './LangCalculationListPage.module.css';

export const LangCalculationListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Достаем пользователя для проверки роли
  const { user } = useSelector((state: RootState) => state.auth);
  const { items, status, error } = useSelector((state: RootState) => state.langCalculations);

  useEffect(() => {
    // В зависимости от роли можно было бы вызывать разные эндпоинты,
    // но если fetchLangCalculations сам понимает по токену, чьи заявки отдать, оставляем так:
    dispatch(fetchLangCalculations());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить этот расчет?')) {
      dispatch(deleteCalculation(id));
    }
  };

  // --- УСЛОВНЫЙ РЕНДЕРИНГ ДЛЯ МОДЕРАТОРА ---
  // Замените условие 'moderator' на то, как у вас в бэкенде называется роль
  if (user?.is_linguist) {
    return <ModeratorDashboard />;
  }

  // --- ДАЛЕЕ КОД ДЛЯ ОБЫЧНОГО ПОЛЬЗОВАТЕЛЯ ---

  if (status === 'loading') {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <Loader2 className="animate-spin mx-auto mb-4 text-foreground" size={32} />
          <p className="font-bold uppercase tracking-widest text-sm">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <AlertTriangle className="mx-auto mb-4" size={32} />
          Ошибка загрузки данных: {typeof error === 'object' ? JSON.stringify(error) : error}
        </div>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.pageTitle}>История расчетов</h1>
      
      {items.length === 0 ? (
        <div className={styles.emptyState}>
          <p className="mb-4">У вас пока нет заявок на расчет дивергенции.</p>
          <Link to="/languages" className={styles.link}>
            Перейти в каталог языков
          </Link>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>ID</th>
                <th className={styles.th}>Дата создания</th>
                <th className={styles.th}>Статус</th>
                <th className={styles.th}>Базовый язык (ID)</th>
                <th className={styles.th}>Объем выборки</th>
                <th className={styles.th}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {items.map(calc => {
                let statusClass = styles.draft;
                if (calc.status === 'сформирован') statusClass = styles.formed;
                if (calc.status === 'завершён') statusClass = styles.completed;
                if (calc.status === 'отклонён') statusClass = styles.rejected;

                return (
                  <tr key={calc.id} className={styles.tr}>
                    <td className={styles.td}>
                      <span className={styles.calcId}>#{calc.id}</span>
                    </td>

                    <td className={styles.td}>
                      <span className={styles.metaText}>
                        {calc.dateCreate 
                          ? new Date(calc.dateCreate).toLocaleString('ru-RU', { 
                              day: '2-digit', month: '2-digit', year: 'numeric',
                              hour: '2-digit', minute: '2-digit' 
                            }) 
                          : '—'}
                      </span>
                    </td>

                    <td className={styles.td}>
                      <span className={`${styles.statusBadge} ${statusClass}`}>
                        {calc.status}
                      </span>
                    </td>

                    <td className={styles.td}>
                      {calc.baseLanguageID ? (
                        <span className={styles.baseLangText}>{calc.baseLanguageID}</span>
                      ) : (
                        <span className={styles.metaText}>Не выбран</span>
                      )}
                    </td>

                    <td className={styles.td}>
                      <span className={styles.metaText}>
                        {calc.languages?.length || 0} языков
                      </span>
                    </td>

                    <td className={styles.td}>
                      <div className={styles.actionsCell}>
                        <Link to={`/LangCalculation/${calc.id}`} className={`${styles.btn} ${styles.btnPrimary}`}>
                          Подробнее <ArrowRight size={14} />
                        </Link>
                        
                        {calc.status === 'черновик' && (
                          <button 
                            className={`${styles.btn} ${styles.btnDestructive}`}
                            onClick={() => handleDelete(calc.id!)}
                            title="Удалить черновик"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};
