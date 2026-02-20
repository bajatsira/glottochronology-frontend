import { useState, useEffect, type FormEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Loader2, Plus, Filter } from 'lucide-react';

import { LanguageCard } from '../components/LanguageCard';
import type { RootState, AppDispatch } from '../store/store';
import { setLanguageFilters, fetchLanguages } from '../store/languagesSlice';
import { addLangToDraft } from '../store/langCalculationsSlice';

import styles from './LanguagesListPage.module.css';

export const LanguagesListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { items: languages, status, error, filters } = useSelector((state: RootState) => state.languages);
  const { user } = useSelector((state: RootState) => state.auth);

  const [localName, setLocalName] = useState(filters.name || '');
  const [localFamily, setLocalFamily] = useState(filters.family || '');
  const [localWriting, setLocalWriting] = useState(filters.writingFamily || '');

  useEffect(() => {
    dispatch(fetchLanguages(filters));
  }, [dispatch, filters]);

  const handleFilterSubmit = (event: FormEvent) => {
    event.preventDefault();
    dispatch(setLanguageFilters({
      name: localName,
      family: localFamily,
      writingFamily: localWriting,
    }));
  };

  const handleAddToDraft = (langId: number) => {
    // TODO: Здесь стоит добавить уведомление (toast) об успехе
    dispatch(addLangToDraft({ draftId: 0, langId }));
  };

  // Состояние загрузки
  if (status === 'loading' && languages.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  // Состояние ошибки
  if (status === 'failed') {
    return (
      <div className={styles.container}>
        <div className={`${styles.alert} ${styles.error}`}>
          Ошибка загрузки данных: {error}
        </div>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.pageTitle}>Каталог Языков</h1>

      {/* --- Фильтры --- */}
      <section className={styles.filtersSection}>
        <div className={styles.filtersTitle}>
          <Filter size={16} />
          Параметры поиска
        </div>
        
        <form onSubmit={handleFilterSubmit} className={styles.filtersGrid}>
          {/* Поле Название */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Название</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Например, Лезгинский"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
            />
          </div>

          {/* Поле Семья */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Языковая семья</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Например, Индоевропейская"
              value={localFamily}
              onChange={(e) => setLocalFamily(e.target.value)}
            />
          </div>

          {/* Селект Письменность */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Письменность</label>
            <select
              className={styles.select}
              value={localWriting}
              onChange={(e) => setLocalWriting(e.target.value)}
            >
              <option value="">Все системы</option>
              <option value="Кириллица">Кириллица</option>
              <option value="Латиница">Латиница</option>
              <option value="Арабская">Арабская</option>
            </select>
          </div>

          {/* Кнопка Поиска */}
          <button type="submit" className={styles.searchButton}>
            <span className="flex items-center gap-2">
               Найти
            </span>
          </button>
        </form>
      </section>

      {/* --- Результаты --- */}
      {languages.length === 0 && status === 'succeeded' && (
        <div className={styles.alert}>
          По вашему запросу языки не найдены. Попробуйте изменить фильтры.
        </div>
      )}

      <div className={styles.cardsGrid}>
        {languages.map((lang) => (
          <div key={lang.id} className={styles.cardWrapper}>
            {/* Карточка языка рендерится как есть */}
            <LanguageCard language={lang} />
            
            {/* Кнопка добавления (рендерится только если есть юзер) */}
            {user && (
              <button 
                className={styles.addButton}
                onClick={() => handleAddToDraft(lang.id)}
              >
                <Plus size={14} />
                Добавить в расчет
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
};
