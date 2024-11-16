import React from "react";
import { useParams } from "react-router-dom";
import DiaryDetail from "./components/DiaryDetail";
import { photo } from "../../assets";
import Comment from "./components/Comment";

const dummyDiaryEntries = [
  {
    id: 1,
    date: { year: 2024, month: 11, day: 13, dayOfWeek: "Wed" },
    title: "Lovely Autumn Walk",
    content:
      "Took a long walk in the park. The leaves are beautiful shades of orange and red!",
    photo: photo,
    mood: "Calm",
  },
  {
    id: 2,
    date: { year: 2024, month: 11, day: 10, dayOfWeek: "Sun" },
    title: "Sunday Brunch",
    content: "Had brunch with some friends. Tried a new cafe and loved it!",
    photo: photo,
    mood: "Happy",
  },
  {
    id: 3,
    date: { year: 2024, month: 10, day: 31, dayOfWeek: "Thu" },
    title: "Halloween Fun",
    content: "Went to a Halloween party and dressed as a witch!",
    photo: photo,
    mood: "Excited",
  },
  {
    id: 4,
    date: { year: 2024, month: 10, day: 22, dayOfWeek: "Tue" },
    title: "Rainy Day",
    content:
      "Spent the day indoors reading a good book. It was cozy and relaxing.",
    photo: photo,
    mood: "Calm",
  },
  {
    id: 5,
    date: { year: 2024, month: 10, day: 20, dayOfWeek: "Sun" },
    title: "Family Gathering",
    content:
      "Had a wonderful family gathering. Everyone was so happy to see each other.",
    photo: photo,
    mood: "Happy",
  },
  {
    id: 6,
    date: { year: 2024, month: 9, day: 2, dayOfWeek: "Mon" },
    title: "Beach Day",
    content: "Went to the beach and relaxed. The waves were calming.",
    photo: photo,
    mood: "Calm",
  },
];

const DiaryDetailPage = () => {
  const { diaryId } = useParams();

  const diaryEntry =
    dummyDiaryEntries.find((entry) => entry.id === parseInt(diaryId)) || null;

  if (!diaryEntry) {
    return <p>Diary entry not found.</p>;
  }

  return (
    <div>
      <DiaryDetail diaryEntry={diaryEntry} />
      <Comment />
    </div>
  );
};

export default DiaryDetailPage;
