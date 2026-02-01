// src/pages/HomePage.tsx
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import styles from './HomePage.module.css';

export const HomePage = () => {
  return (
    <div className={styles.pageContainer}>
      <Container fluid className="mt-4 mb-5">
        
        {/* Заголовок секции */}
        <h1 className={styles.sectionHeader}>
          О проекте
          <br />
          <span style={{ fontSize: '1rem', fontWeight: 400, color: '#666', marginLeft: '0' }}>
            React SPA
          </span>
        </h1>

        {/* СЕТКА СТАТИЧНЫХ СТАТЕЙ */}
        <div className={styles.gridContainer}>
          
          {/* Статья 1 (Большая ссылка на список языков) */}
          <Link to="/languages" className={styles.articleCard}>
            <img 
              src="https://staticn1.nplus1.ru/images/2023/05/23/065337ec7e9308be767b07559e54d7f0.jpg" 
              alt="Языки мира" 
              className={styles.cardImage}
            />
            <div className={styles.cardOverlay}>
              <span className={styles.cardRubric}>База данных</span>
              <h3 className={styles.cardTitle}>
                Каталог языков и диалектов
              </h3>
              <div className={styles.cardDescription} style={{ color: '#fff' }}>
                Перейти к полному списку, настроить фильтры и изучить детали.
              </div>
            </div>
          </Link>

          {/* Статья 2 (О методе) */}
          <div className={styles.articleCard}>
            <img 
              src="https://staticn1.nplus1.ru/images/2021/04/25/472537d6e66275252a65d6e27df7c62d.jpg" 
              alt="Метод" 
              className={styles.cardImage}
            />
            <div className={styles.cardOverlay}>
              <span className={styles.cardRubric}>Методология</span>
              <h3 className={styles.cardTitle}>
                Глоттохронология: как считать время?
              </h3>
              <div className={styles.cardDescription} style={{ color: '#fff' }}>
                Мы используем списки Сводеша для оценки степени родства между языками
                на основе лексических совпадений.
              </div>
            </div>
          </div>

          {/* Статья 3 (Технологии) */}
          <div className={styles.articleCard}>
            <img 
              src="https://staticn1.nplus1.ru/images/2019/11/08/9de535dfd95b4cfdd264257be4f767a4.jpg" 
              alt="Технологии" 
              className={styles.cardImage}
            />
            <div className={styles.cardOverlay}>
              <span className={styles.cardRubric}>Разработка</span>
              <h3 className={styles.cardTitle}>
                Стек технологий: Golang + React
              </h3>
              <div className={styles.cardDescription} style={{ color: '#fff' }}>
                Быстрый бэкенд на Gin, объектное хранилище Minio и современный фронтенд на Vite.
              </div>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
};
