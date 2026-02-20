import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Trash2, Loader2, AlertTriangle } from 'lucide-react';

import { 
  fetchLangCalculationById, 
  removeLangFromDraft, 
  confirmCalculation, 
  clearCurrentDetail,
  setBaseLanguage,
  deleteCalculation 
} from '../store/langCalculationsSlice';

import type { RootState, AppDispatch } from '../store/store';
import styles from './LangCalculationDetailPage.module.css';

export const LangCalculationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { currentDetail, status, error } = useSelector((state: RootState) => state.langCalculations);

  useEffect(() => {
    if (id) {
      dispatch(fetchLangCalculationById(Number(id)));
    }
    return () => {
        dispatch(clearCurrentDetail());
    };
  }, [id, dispatch]);

  const handleRemoveLang = (langId: number) => {
    if (currentDetail?.id && confirm('Убрать язык из расчета?')) {
        dispatch(removeLangFromDraft({ draftId: currentDetail.id, langId }));
    }
  };

  const handleSetBase = (langId: number) => {
    if (currentDetail?.id) {
        dispatch(setBaseLanguage({ calculationId: currentDetail.id, languageId: langId }));
    }
  };

  const handleConfirm = async () => {
    if (currentDetail?.id && confirm('Завершить заявку? Редактирование станет недоступным.')) {
        await dispatch(confirmCalculation(currentDetail.id));
        navigate('/LangCalculation'); 
    }
  };

  const handleDeleteDraft = async () => {
    if (currentDetail?.id && confirm('Удалить эту заявку безвозвратно?')) {
        await dispatch(deleteCalculation(currentDetail.id));
        navigate('/LangCalculation'); 
    }
  };

  if (status === 'loading') {
      return (
        <div className="flex justify-center items-center min-h-screen text-foreground">
          <Loader2 className="animate-spin mr-2" /> Загрузка данных...
        </div>
      );
  }

  if (error) {
      return (
        <div className="p-10 text-center text-destructive">
          <AlertTriangle className="mx-auto mb-2" />
          {typeof error === 'object' ? JSON.stringify(error) : error}
        </div>
      );
  }

  if (!currentDetail) {
      return <div className="p-10 text-center text-muted-foreground">Заявка не найдена</div>;
  }

  const isDraft = currentDetail.status === 'черновик';
  
  // Проверка для блокировки кнопки формирования
  const hasBaseLang = currentDetail.languages?.some(l => l.isBase);

  return (
    <main className={styles.container}>
      
      <Link to="/LangCalculation" className={styles.backLink}>
        <ArrowLeft size={16} /> К списку расчетов
      </Link>

      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Заявка #{currentDetail.id}</h1>
          <span className={styles.statusBadge}>{currentDetail.status}</span>
        </div>
      </header>

      {/* Поля заявки (Текст сверху) */}
      <section className={styles.calculationInfo}>
        <div className={styles.infoBlock}>
          <span className={styles.infoLabel}>Коэффициент дивергенции</span>
          {currentDetail.similarityRate !== null && currentDetail.similarityRate !== undefined ? (
            <span className={styles.infoValue}>{(currentDetail.similarityRate * 100).toFixed(1)}%</span>
          ) : (
            <span className={styles.infoPlaceholder}>Расчет не проведен</span>
          )}
        </div>

        <div className={styles.infoBlock}>
          <span className={styles.infoLabel}>Время расхождения</span>
          {currentDetail.resultYearsAgo ? (
            <span className={styles.infoValue}>{currentDetail.resultYearsAgo} лет назад</span>
          ) : (
            <span className={styles.infoPlaceholder}>Расчет не проведен</span>
          )}
        </div>
      </section>

      {/* Услуги (Карточки в 1 столбец) */}
      <section>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Состав выборки</h2>
          {isDraft && (
            <Link to="/languages" className={styles.addBtn}>
              + Добавить язык
            </Link>
          )}
        </div>

        <div className={styles.cardsList}>
          {currentDetail.languages?.map(item => {
            const langId = item.language?.id!;
            return (
              <div 
                key={item.id} 
                className={`${styles.serviceCard} ${item.isBase ? styles.isBase : ''}`}
              >
                {/* Левая часть: Инфо об услуге */}
                <div className={styles.cardContent}>
                  <Link to={`/languages/${langId}`} className={styles.langName}>
                    {item.language?.name}
                  </Link>
                  <span className={styles.langFamily}>
                    Семья: {item.language?.family}
                  </span>
                </div>

                {/* Правая часть: Поле М-М (Галочка) и Удаление */}
                <div className={styles.cardActions}>
                  
                  {/* Поле М-М: Выбор базового языка (Галочка справа) */}
                  <div className={styles.mmField}>
                    <span className={styles.mmLabel}>Базовый язык:</span>
                    <input 
                      type="radio"
                      name="baseLang"
                      checked={item.isBase}
                      onChange={() => isDraft && handleSetBase(langId)}
                      className={styles.radioInput}
                      disabled={!isDraft}
                      title={isDraft ? "Назначить этот язык точкой отсчета" : ""}
                    />
                  </div>

                  {/* Кнопка удаления */}
                  {isDraft && (
                    <button 
                      onClick={() => handleRemoveLang(langId)}
                      className={styles.deleteBtn}
                      title="Удалить из заявки"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {(!currentDetail.languages || currentDetail.languages.length === 0) && (
            <div className={styles.emptyState}>
               Список пуст. Перейдите в каталог, чтобы добавить языки для сравнения.
            </div>
          )}
        </div>
      </section>

      {/* Кнопки действий (Только для черновика) */}
      {isDraft && (
        <footer className={styles.footerActions}>
          <button 
            onClick={handleDeleteDraft}
            className={`${styles.btn} ${styles.btnDestructive}`}
          >
            Удалить заявку
          </button>

          <button 
            onClick={handleConfirm}
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled={!currentDetail.languages || currentDetail.languages.length < 2 || !hasBaseLang}
            title={!hasBaseLang ? "Необходимо выбрать базовый язык" : ""}
          >
            Отправить заявку
          </button>
        </footer>
      )}

    </main>
  );
};
