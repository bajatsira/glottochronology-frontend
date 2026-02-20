import { Link } from "react-router-dom";
import { ArrowRight, Globe, Clock, Database } from "lucide-react";
import styles from "./HomePage.module.css";

export const HomePage = () => { 
  return (
    <main className={styles.main}>
      
      {/* Hero Section */}
      <section className={`${styles.sectionContainer} ${styles.heroSection}`}>
        <div className={styles.heroGrid}>
          
          {/* Левая колонка */}
          <div>
            <span className={styles.label}>
              Project Lab 1.0
            </span>
            <h1 className={styles.title}>
              TIME <br />
              IS <br />
              LANGUAGE
            </h1>
            
            <div className={styles.versionLine}>
              <span className={styles.separator}></span>
              <span className={styles.versionText}>v.2026.02</span>
            </div>
          </div>

          {/* Правая колонка */}
          <div className={styles.contentColumn}>
            <p className={styles.description}>
              <span className={styles.highlight}>Глоттохронология</span> — метод 
              датировки разделения языков. Мы используем списки Сводеша, 
              чтобы рассчитать приблизительное время расхождения родственных 
              языков на основе процента сохранившихся когнатов в базовой лексике.
            </p>

            <div className={styles.actions}>
              <Link to="/languages" className={styles.btnPrimary}>
                Исследуйте дивергенцию языков
                <ArrowRight size={16} />
              </Link>
              
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={`${styles.sectionContainer} ${styles.featuresSection}`}>
        <div className={styles.featuresGrid}>
          
          <div className={styles.featureCard}>
            <Globe className={styles.featureIcon} size={32} strokeWidth={1.5} />
            <h3 className={styles.featureTitle}>База знаний</h3>
            <p className={styles.featureText}>
              Структурированная коллекция языков, классифицированная по семьям 
              и группам. Для каждого языка доступны детальные 100-словные 
              списки Сводеша.
            </p>
          </div>

          <div className={styles.featureCard}>
            <Clock className={styles.featureIcon} size={32} strokeWidth={1.5} />
            <h3 className={styles.featureTitle}>Расчет дивергенции</h3>
            <p className={styles.featureText}>
              Выберите базовый язык и сравните его с другими, чтобы оценить 
              историческую дату их разделения, используя формулы 
              лексикостатистики.

            </p>
          </div>

          <div className={styles.featureCard}>
            <Database className={styles.featureIcon} size={32} strokeWidth={1.5} />
            <h3 className={styles.featureTitle}>Верификация</h3>
            <p className={styles.featureText}>
              Каждая заявка на расчет 
              проходит обязательную модерацию и утверждение 
              лингвистом перед публикацией результатов.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
};

