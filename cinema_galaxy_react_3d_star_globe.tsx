import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';

const DECADE_COUNTRIES = [
  { id: '1950s–60s', title: '1950s–60s • GOLDEN EMPIRE', lonCenter: -120, lonSpan: 112, latCenter: 35, latSpan: 58, color: 0xd97706, hex: '#f59e0b' },
  { id: '1970s',     title: '1970s • NEW WAVE REALM',    lonCenter: 0,    lonSpan: 112, latCenter: 35, latSpan: 58, color: 0xe11d48, hex: '#fb7185' },
  { id: '1980s',     title: '1980s • BLOCKBUSTER NATION',lonCenter: 120,  lonSpan: 112, latCenter: 35, latSpan: 58, color: 0x9333ea, hex: '#c084fc' },
  { id: '1990s',     title: '1990s • ROMANCE REPUBLIC',  lonCenter: -120, lonSpan: 112, latCenter: -35, latSpan: 58, color: 0x0284c7, hex: '#38bdf8' },
  { id: '2000s',     title: '2000s • MILLENNIUM LAND',   lonCenter: 0,    lonSpan: 112, latCenter: -35, latSpan: 58, color: 0x059669, hex: '#34d399' },
  { id: '2010s–20s', title: '2010s–20s • MODERN FRONTIER', lonCenter: 120,  lonSpan: 112, latCenter: -35, latSpan: 58, color: 0xea580c, hex: '#fb923c' }
];

const INITIAL_STARS = [
  // 1950s–60s
  { name: 'Dilip Kumar', industry: 'Bollywood', era: '1950s–60s', epithet: 'The Tragedy King', born: '11 Dec 1922', died: '7 Jul 2021', awards: '8 Filmfare Best Actor, Dadasaheb Phalke Award', movies: ['Mughal-e-Azam', 'Devdas', 'Naya Daur', 'Ganga Jumna', 'Madhumati', 'Aan'], wiki: 'Dilip Kumar', bio: 'Pioneered method acting in Indian cinema with unforgettable dramatic depth.' },
  { name: 'Raj Kapoor', industry: 'Bollywood', era: '1950s–60s', epithet: 'The Greatest Showman', born: '14 Dec 1924', died: '2 Jun 1988', awards: '3 National Film Awards, 11 Filmfare Awards', movies: ['Awaara', 'Shree 420', 'Sangam', 'Mera Naam Joker', 'Anari', 'Barsaat'], wiki: 'Raj Kapoor', bio: 'Actor-filmmaker whose Chaplin-inspired persona charmed audiences across Asia and Europe.' },
  { name: 'Dev Anand', industry: 'Bollywood', era: '1950s–60s', epithet: 'The Evergreen Hero', born: '26 Sep 1923', died: '3 Dec 2011', awards: '2 Filmfare Awards, Dadasaheb Phalke Award', movies: ['Guide', 'Jewel Thief', 'CID', 'Hum Dono', 'Kala Pani', 'Johny Mera Naam'], wiki: 'Dev Anand', bio: 'Celebrated for his debonair charm, rapid-fire dialogue delivery, and timeless style.' },
  { name: 'Madhubala', industry: 'Bollywood', era: '1950s–60s', epithet: 'The Venus of Indian Cinema', born: '14 Feb 1933', died: '23 Feb 1969', awards: 'Icon of Golden Age Cinema', movies: ['Mughal-e-Azam', 'Chalti Ka Naam Gaadi', 'Mahal', "Mr. & Mrs. '55", 'Howrah Bridge'], wiki: 'Madhubala', bio: 'Immortalized as Anarkali in Mughal-e-Azam, radiating effortless grace and comic timing.' },
  { name: 'Nargis', industry: 'Bollywood', era: '1950s–60s', epithet: 'First Lady of Indian Cinema', born: '1 Jun 1929', died: '3 May 1981', awards: 'National Film Award, Filmfare Best Actress', movies: ['Mother India', 'Awaara', 'Shree 420', 'Andaz', 'Chori Chori'], wiki: 'Nargis', bio: "Delivered one of world cinema's greatest performances in the Oscar-nominated Mother India." },
  { name: 'Meena Kumari', industry: 'Bollywood', era: '1950s–60s', epithet: 'The Tragedy Queen', born: '1 Aug 1933', died: '31 Mar 1972', awards: '4 Filmfare Best Actress Awards', movies: ['Pakeezah', 'Sahib Bibi Aur Ghulam', 'Baiju Bawra', 'Dil Apna Aur Preet Parai'], wiki: 'Meena Kumari', bio: 'Revered for her poetic voice and deeply moving portrayals of Indian women.' },
  { name: 'Guru Dutt', industry: 'Bollywood', era: '1950s–60s', epithet: 'Master of Chiaroscuro', born: '9 Jul 1925', died: '10 Oct 1964', awards: 'Filmfare Best Director', movies: ['Pyaasa', 'Kaagaz Ke Phool', 'Sahib Bibi Aur Ghulam', "Mr. & Mrs. '55", 'Aar-Paar'], wiki: 'Guru Dutt', bio: 'Visionary auteur whose lyrical framing and soulful storytelling defined poetic cinema.' },
  { name: 'Waheeda Rehman', industry: 'Bollywood', era: '1950s–60s', epithet: 'Grace Personified', born: '3 Feb 1938', died: null, awards: 'National Film Award, Dadasaheb Phalke Award', movies: ['Guide', 'Pyaasa', 'Khamoshi', 'Teesri Kasam', 'Reshma Aur Shera'], wiki: 'Waheeda Rehman', bio: 'Classical dancer and powerhouse actress celebrated for luminous, nuanced roles.' },
  { name: 'Shammi Kapoor', industry: 'Bollywood', era: '1950s–60s', epithet: 'The Rebel Star', born: '21 Oct 1931', died: '14 Aug 2011', awards: '2 Filmfare Awards', movies: ['Junglee', 'Teesri Manzil', 'Kashmir Ki Kali', 'Brahmachari', 'An Evening in Paris'], wiki: 'Shammi Kapoor', bio: 'Brought rock-and-roll energy and unbridled joy to 1960s Bollywood musicals.' },
  { name: 'Dharmendra', industry: 'Bollywood', era: '1950s–60s', epithet: 'The He-Man of Bollywood', born: '8 Dec 1935', died: null, awards: 'Filmfare Lifetime Achievement Award', movies: ['Sholay', 'Chupke Chupke', 'Satyakam', 'Phool Aur Patthar', 'Anupama'], wiki: 'Dharmendra', bio: 'Beloved across six decades for both rugged action charisma and effortless comedy.' },
  { name: 'Marilyn Monroe', industry: 'Hollywood', era: '1950s–60s', epithet: 'Ultimate Pop Culture Icon', born: '1 Jun 1926', died: '4 Aug 1962', awards: 'Golden Globe Best Actress', movies: ['Some Like It Hot', 'The Seven Year Itch', 'Gentlemen Prefer Blondes', 'Niagara', 'The Misfits'], wiki: 'Marilyn Monroe', bio: 'Timeless Hollywood legend whose luminous screen presence defined mid-century glamour.' },
  { name: 'Audrey Hepburn', industry: 'Hollywood', era: '1950s–60s', epithet: 'Timeless Elegance', born: '4 May 1929', died: '20 Jan 1993', awards: 'Academy Award, EGOT Winner', movies: ['Roman Holiday', "Breakfast at Tiffany's", 'My Fair Lady', 'Sabrina', 'Charade'], wiki: 'Audrey Hepburn', bio: 'Academy Award winner and humanitarian celebrated for unmatched poise and charm.' },
  { name: 'Marlon Brando', industry: 'Hollywood', era: '1950s–60s', epithet: 'Father of Modern Acting', born: '3 Apr 1924', died: '1 Jul 2004', awards: '2 Academy Awards for Best Actor', movies: ['The Godfather', 'On the Waterfront', 'A Streetcar Named Desire', 'Apocalypse Now'], wiki: 'Marlon Brando', bio: 'Revolutionized screen acting forever with raw emotional realism.' },
  { name: 'James Dean', industry: 'Hollywood', era: '1950s–60s', epithet: 'Rebel Without a Cause', born: '8 Feb 1931', died: '30 Sep 1955', awards: '2 Posthumous Oscar Nominations', movies: ['Rebel Without a Cause', 'East of Eden', 'Giant'], wiki: 'James Dean', bio: 'Became an eternal symbol of youthful angst and rebellion in just three iconic films.' },
  { name: 'Elizabeth Taylor', industry: 'Hollywood', era: '1950s–60s', epithet: 'The Violet-Eyed Legend', born: '27 Feb 1932', died: '23 Mar 2011', awards: '2 Academy Awards for Best Actress', movies: ['Cleopatra', "Who's Afraid of Virginia Woolf?", 'Cat on a Hot Tin Roof', 'Giant'], wiki: 'Elizabeth Taylor', bio: 'One of the last great stars of Classical Hollywood Cinema.' },
  { name: 'Cary Grant', industry: 'Hollywood', era: '1950s–60s', epithet: 'Epitome of Suave', born: '18 Jan 1904', died: '29 Nov 1986', awards: 'Honorary Academy Award', movies: ['North by Northwest', 'To Catch a Thief', 'Charade', 'Notorious', 'His Girl Friday'], wiki: 'Cary Grant', bio: 'Defined wit, sophistication, and comic timing across Hitchcock thrillers and screwball comedies.' },
  { name: 'Paul Newman', industry: 'Hollywood', era: '1950s–60s', epithet: 'The Cool Hand Legend', born: '26 Jan 1925', died: '26 Sep 2008', awards: 'Academy Award, 10 Oscar Nominations', movies: ['Cool Hand Luke', 'Butch Cassidy and the Sundance Kid', 'The Sting', 'The Hustler'], wiki: 'Paul Newman', bio: 'Screen icon celebrated for piercing intensity, charisma, and philanthropy.' },
  { name: 'Sidney Poitier', industry: 'Hollywood', era: '1950s–60s', epithet: 'Trailblazing Icon', born: '20 Feb 1927', died: '6 Jan 2022', awards: 'Academy Award for Best Actor', movies: ['In the Heat of the Night', "Guess Who's Coming to Dinner", 'Lilies of the Field', 'To Sir, with Love'], wiki: 'Sidney Poitier', bio: 'First Black actor to win the Academy Award for Best Actor, breaking historic barriers.' },
  { name: 'Humphrey Bogart', industry: 'Hollywood', era: '1950s–60s', epithet: "AFI's Greatest Male Star", born: '25 Dec 1899', died: '14 Jan 1957', awards: 'Academy Award for Best Actor', movies: ['Casablanca', 'The African Queen', 'The Maltese Falcon', 'The Treasure of the Sierra Madre'], wiki: 'Humphrey Bogart', bio: 'Cultural icon renowned for stoic, cynical antiheroes with hidden nobility.' },
  { name: 'Sean Connery', industry: 'Hollywood', era: '1950s–60s', epithet: 'The Original 007', born: '25 Aug 1930', died: '31 Oct 2020', awards: 'Academy Award, BAFTA, 3 Golden Globes', movies: ['Goldfinger', 'Dr. No', 'From Russia with Love', 'The Untouchables'], wiki: 'Sean Connery', bio: 'Defined James Bond and enjoyed a celebrated career spanning five decades.' },

  // 1970s
  { name: 'Amitabh Bachchan', industry: 'Bollywood', era: '1970s', epithet: 'Shahenshah of Bollywood', born: '11 Oct 1942', died: null, awards: '4 National Film Awards, Dadasaheb Phalke Award', movies: ['Sholay', 'Deewaar', 'Zanjeer', 'Don', 'Black', 'Piku', 'Agneepath'], wiki: 'Amitabh Bachchan', bio: 'The Angry Young Man who redefined Indian cinema and remains an unrivaled icon.' },
  { name: 'Rajesh Khanna', industry: 'Bollywood', era: '1970s', epithet: "India's First Superstar", born: '29 Dec 1942', died: '18 Jul 2012', awards: '3 Filmfare Best Actor Awards', movies: ['Aradhana', 'Anand', 'Amar Prem', 'Kati Patang', 'Bawarchi', 'Namak Haraam'], wiki: 'Rajesh Khanna', bio: 'Delivered 15 consecutive solo superhits between 1969 and 1971, inspiring unprecedented frenzy.' },
  { name: 'Rekha', industry: 'Bollywood', era: '1970s', epithet: 'The Enigmatic Diva', born: '10 Oct 1954', died: null, awards: 'National Film Award, 3 Filmfare Awards', movies: ['Umrao Jaan', 'Silsila', 'Khubsoorat', 'Khoon Bhari Maang', 'Muqaddar Ka Sikandar'], wiki: 'Rekha', bio: 'Celebrated for transformative versatility, timeless mystique, and magnetic screen presence.' },
  { name: 'Hema Malini', industry: 'Bollywood', era: '1970s', epithet: 'The Dream Girl', born: '16 Oct 1948', died: null, awards: 'Filmfare Best Actress, Padma Shri', movies: ['Sholay', 'Seeta Aur Geeta', 'Dream Girl', 'Satte Pe Satta', 'Baghban'], wiki: 'Hema Malini', bio: 'Classical dancer and box-office queen immortalized as Basanti in Sholay.' },
  { name: 'Jaya Bachchan', industry: 'Bollywood', era: '1970s', epithet: 'Queen of Naturalism', born: '9 Apr 1948', died: null, awards: '9 Filmfare Awards, Padma Shri', movies: ['Guddi', 'Abhimaan', 'Mili', 'Sholay', 'Koshish', 'Kabhi Khushi Kabhie Gham'], wiki: 'Jaya Bachchan', bio: 'Brought warmth, intelligence, and realism to middle-class Indian cinema.' },
  { name: 'Zeenat Aman', industry: 'Bollywood', era: '1970s', epithet: 'The Bohemian Trailblazer', born: '19 Nov 1951', died: null, awards: 'Filmfare Best Supporting Actress', movies: ['Hare Rama Hare Krishna', 'Don', 'Satyam Shivam Sundaram', 'Yaadon Ki Baaraat', 'Qurbani'], wiki: 'Zeenat Aman', bio: 'Shattered conventions and brought modern, fearless glamour to 1970s Bollywood.' },
  { name: 'Rishi Kapoor', industry: 'Bollywood', era: '1970s', epithet: 'The Romantic Maestro', born: '4 Sep 1952', died: '30 Apr 2020', awards: 'National Film Award, 4 Filmfare Awards', movies: ['Bobby', 'Karz', 'Amar Akbar Anthony', 'Chandni', 'Agneepath', 'Kapoor & Sons'], wiki: 'Rishi Kapoor', bio: 'Started as a teenage heartthrob in Bobby and evolved into one of cinema’s finest character actors.' },
  { name: 'Mithun Chakraborty', industry: 'Bollywood', era: '1970s', epithet: 'The Disco Dancer', born: '16 Jun 1950', died: null, awards: '3 National Film Awards, Dadasaheb Phalke Award', movies: ['Mrigayaa', 'Disco Dancer', 'Agneepath', 'Tahader Katha', 'Guru'], wiki: 'Mithun Chakraborty', bio: 'Won a National Award on debut before becoming an international dance phenomenon.' },
  { name: 'Shabana Azmi', industry: 'Bollywood', era: '1970s', epithet: 'Queen of Parallel Cinema', born: '18 Sep 1950', died: null, awards: '5 National Film Awards for Best Actress', movies: ['Ankur', 'Arth', 'Mandi', 'Masoom', 'Neerja'], wiki: 'Shabana Azmi', bio: 'Record five-time National Award winner celebrated for fearless, socially conscious cinema.' },
  { name: 'Naseeruddin Shah', industry: 'Bollywood', era: '1970s', epithet: 'The Stage & Screen Titan', born: '20 Jul 1950', died: null, awards: '3 National Film Awards', movies: ['Sparsh', 'Masoom', 'Jaane Bhi Do Yaaro', 'A Wednesday!', 'Sarfarosh'], wiki: 'Naseeruddin Shah', bio: 'Pillar of parallel cinema and theatre with astonishing range across genres.' },
  { name: 'Al Pacino', industry: 'Hollywood', era: '1970s', epithet: 'The Intensity Titan', born: '25 Apr 1940', died: null, awards: 'Academy Award, Triple Crown of Acting', movies: ['The Godfather', 'The Godfather Part II', 'Scarface', 'Dog Day Afternoon', 'Scent of a Woman', 'Heat'], wiki: 'Al Pacino', bio: 'Electrifying method actor whose work in the 1970s reshaped American cinema.' },
  { name: 'Robert De Niro', industry: 'Hollywood', era: '1970s', epithet: 'The Chameleon', born: '17 Aug 1943', died: null, awards: '2 Academy Awards', movies: ['Taxi Driver', 'Raging Bull', 'The Godfather Part II', 'Goodfellas', 'Casino', 'Heat'], wiki: 'Robert De Niro', bio: 'Legendary collaborator of Martin Scorsese renowned for total physical transformation.' },
  { name: 'Jack Nicholson', industry: 'Hollywood', era: '1970s', epithet: 'The Grin of Cinema', born: '22 Apr 1937', died: null, awards: '3 Academy Awards, 12 Nominations', movies: ["One Flew Over the Cuckoo's Nest", 'The Shining', 'Chinatown', 'As Good as It Gets', 'The Departed'], wiki: 'Jack Nicholson', bio: 'Most nominated male actor in Academy Award history, radiating magnetic rebellion.' },
  { name: 'Meryl Streep', industry: 'Hollywood', era: '1970s', epithet: 'The Greatest of Her Generation', born: '22 Jun 1949', died: null, awards: '3 Academy Awards, 21 Nominations', movies: ["Sophie's Choice", 'Kramer vs. Kramer', 'The Devil Wears Prada', 'Out of Africa', 'Doubt'], wiki: 'Meryl Streep', bio: 'Unmatched mastery of accents, emotional nuance, and character transformation.' },
  { name: 'Dustin Hoffman', industry: 'Hollywood', era: '1970s', epithet: 'Method Perfectionist', born: '8 Aug 1937', died: null, awards: '2 Academy Awards', movies: ['The Graduate', 'Kramer vs. Kramer', 'Rain Man', 'Tootsie', "All the President's Men"], wiki: 'Dustin Hoffman', bio: 'Redefined the Hollywood leading man with vulnerable, fiercely committed performances.' },
  { name: 'Sylvester Stallone', industry: 'Hollywood', era: '1970s', epithet: 'The Italian Stallion', born: '6 Jul 1946', died: null, awards: 'Golden Globe, 3 Oscar Nominations', movies: ['Rocky', 'First Blood', 'Creed', 'The Expendables', 'Cliffhanger'], wiki: 'Sylvester Stallone', bio: 'Wrote and starred in Rocky, creating cinema’s ultimate underdog franchise.' },
  { name: 'Bruce Lee', industry: 'Hollywood', era: '1970s', epithet: 'The Dragon', born: '27 Nov 1940', died: '20 Jul 1973', awards: 'Hong Kong Film Award Lifetime Achievement', movies: ['Enter the Dragon', 'Fist of Fury', 'The Way of the Dragon', 'The Big Boss'], wiki: 'Bruce Lee', bio: 'Martial arts philosopher who bridged East and West and revolutionized action cinema.' },
  { name: 'Jodie Foster', industry: 'Hollywood', era: '1970s', epithet: 'Two-Time Oscar Titan', born: '19 Nov 1962', died: null, awards: '2 Academy Awards', movies: ['The Silence of the Lambs', 'Taxi Driver', 'The Accused', 'Contact', 'Nyad'], wiki: 'Jodie Foster', bio: 'Earned her first Oscar nomination at 14 and two Best Actress Oscars by age 29.' },
  { name: 'Bill Murray', industry: 'Hollywood', era: '1970s', epithet: 'Deadpan Legend', born: '21 Sep 1950', died: null, awards: 'BAFTA, Golden Globe, Oscar Nominee', movies: ['Ghostbusters', 'Groundhog Day', 'Lost in Translation', 'Caddyshack', 'Rushmore'], wiki: 'Bill Murray', bio: 'Beloved for dry wit across comedy blockbusters and Wes Anderson masterpieces.' },
  { name: 'Clint Eastwood', industry: 'Hollywood', era: '1970s', epithet: 'Dirty Harry & Unforgiven', born: '31 May 1930', died: null, awards: '4 Academy Awards', movies: ['Dirty Harry', 'The Good, the Bad and the Ugly', 'Unforgiven', 'Million Dollar Baby'], wiki: 'Clint Eastwood', bio: 'Iconic antihero turned four-time Academy Award-winning director.' },

  // 1980s
  { name: 'Sridevi', industry: 'Bollywood', era: '1980s', epithet: 'First Female Superstar', born: '13 Aug 1963', died: '24 Feb 2018', awards: 'National Film Award, 5 Filmfare Awards', movies: ['Chandni', 'Mr. India', 'Sadma', 'Lamhe', 'ChaalBaaz', 'English Vinglish'], wiki: 'Sridevi', bio: 'Unrivaled screen goddess capable of carrying massive blockbusters single-handedly.' },
  { name: 'Anil Kapoor', industry: 'Bollywood', era: '1980s', epithet: 'Jhakaas Forever', born: '24 Dec 1956', died: null, awards: '2 National Film Awards, 6 Filmfare Awards', movies: ['Mr. India', 'Tezaab', 'Lamhe', 'Ram Lakhan', 'Slumdog Millionaire', 'Dil Dhadakne Do'], wiki: 'Anil Kapoor', bio: 'Boundless energy and versatility across four decades of Indian and global cinema.' },
  { name: 'Jackie Shroff', industry: 'Bollywood', era: '1980s', epithet: 'Jaggu Dada', born: '1 Feb 1957', died: null, awards: '4 Filmfare Awards', movies: ['Hero', 'Ram Lakhan', 'Parinda', 'Rangeela', 'Devdas'], wiki: 'Jackie Shroff', bio: 'Effortless streetwise cool combined with soulful dramatic performances.' },
  { name: 'Sunny Deol', industry: 'Bollywood', era: '1980s', epithet: 'Dhai Kilo Ka Haath', born: '19 Oct 1957', died: null, awards: '2 National Film Awards', movies: ['Ghayal', 'Damini', 'Gadar: Ek Prem Katha', 'Border', 'Arjun', 'Gadar 2'], wiki: 'Sunny Deol', bio: 'Iconic action powerhouse famous for thunderous emotion and historic box-office records.' },
  { name: 'Govinda', industry: 'Bollywood', era: '1980s', epithet: 'Hero No. 1', born: '21 Dec 1963', died: null, awards: 'Filmfare Special Award', movies: ['Coolie No. 1', 'Hero No. 1', 'Raja Babu', 'Dulhe Raja', 'Partner', 'Aankhen'], wiki: 'Govinda (actor)', bio: 'Unmatched comic timing and rubber-limbed dance brilliance that defined 80s and 90s comedy.' },
  { name: 'Juhi Chawla', industry: 'Bollywood', era: '1980s', epithet: 'Queen of Charm', born: '13 Nov 1967', died: null, awards: '2 Filmfare Awards', movies: ['Qayamat Se Qayamat Tak', 'Hum Hain Rahi Pyar Ke', 'Darr', 'Yes Boss', 'Ishq'], wiki: 'Juhi Chawla', bio: 'Effervescent smile and sparkling comic flair that lit up the screen.' },
  { name: 'Sanjay Dutt', industry: 'Bollywood', era: '1980s', epithet: 'Sanju Baba', born: '29 Jul 1959', died: null, awards: '2 Filmfare Awards', movies: ['Munna Bhai M.B.B.S.', 'Vaastav', 'Khalnayak', 'Saajan', 'Agneepath'], wiki: 'Sanjay Dutt', bio: 'Magnetism spanning rugged 80s-90s action hits to the beloved Munna Bhai.' },
  { name: 'Dimple Kapadia', industry: 'Bollywood', era: '1980s', epithet: 'Bobby to Rudaali', born: '8 Jun 1957', died: null, awards: 'National Film Award, 4 Filmfare Awards', movies: ['Bobby', 'Saagar', 'Rudaali', 'Dil Chahta Hai', 'Tenet', 'Pathaan'], wiki: 'Dimple Kapadia', bio: 'Teen sensation in Bobby who blossomed into a National Award-winning dramatic force.' },
  { name: 'Meenakshi Seshadri', industry: 'Bollywood', era: '1980s', epithet: 'The Classical Grace', born: '16 Nov 1963', died: null, awards: 'Filmfare Nominee', movies: ['Damini', 'Hero', 'Ghayal', 'Ghatak', 'Shahenshah'], wiki: 'Meenakshi Seshadri', bio: 'Accomplished classical dancer who delivered an unforgettable performance in Damini.' },
  { name: 'Mandakini', industry: 'Bollywood', era: '1980s', epithet: 'Ram Teri Ganga Maili Star', born: '30 Jul 1963', died: null, awards: 'Filmfare Best Actress Nominee', movies: ['Ram Teri Ganga Maili', 'Dance Dance', 'Tezaab', 'Aag Aur Shola'], wiki: 'Mandakini (actress)', bio: 'Became an overnight sensation across India in Raj Kapoor’s Ram Teri Ganga Maili.' },
  { name: 'Tom Cruise', industry: 'Hollywood', era: '1980s', epithet: 'The Last Movie Star', born: '3 Jul 1962', died: null, awards: '3 Golden Globes, 4 Oscar Nominations', movies: ['Top Gun', 'Mission: Impossible', 'Jerry Maguire', 'Rain Man', 'Top Gun: Maverick'], wiki: 'Tom Cruise', bio: 'Global box-office titan famous for death-defying practical stunts and relentless charisma.' },
  { name: 'Harrison Ford', industry: 'Hollywood', era: '1980s', epithet: 'Indiana Jones & Han Solo', born: '13 Jul 1942', died: null, awards: 'AFI Life Achievement, Cannes Honorary Palme d’Or', movies: ['Raiders of the Lost Ark', 'Star Wars', 'Blade Runner', 'The Fugitive', 'Witness'], wiki: 'Harrison Ford', bio: 'Portrayed two of cinema’s greatest adventure heroes across half a century.' },
  { name: 'Arnold Schwarzenegger', industry: 'Hollywood', era: '1980s', epithet: 'The Terminator', born: '30 Jul 1947', died: null, awards: 'Golden Globe Winner', movies: ['The Terminator', 'Terminator 2: Judgment Day', 'Predator', 'Total Recall', 'True Lies'], wiki: 'Arnold Schwarzenegger', bio: 'Bodybuilding champion turned box-office king of 1980s and 1990s action cinema.' },
  { name: 'Sigourney Weaver', industry: 'Hollywood', era: '1980s', epithet: 'Ellen Ripley', born: '8 Oct 1949', died: null, awards: 'BAFTA, 2 Golden Globes, 3 Oscar Nominations', movies: ['Alien', 'Aliens', 'Ghostbusters', 'Gorillas in the Mist', 'Avatar'], wiki: 'Sigourney Weaver', bio: 'Shattered action hero stereotypes forever as Warrant Officer Ellen Ripley.' },
  { name: 'Eddie Murphy', industry: 'Hollywood', era: '1980s', epithet: 'Comedy Phenomenon', born: '3 Apr 1961', died: null, awards: 'Golden Globe, Emmy, Mark Twain Prize', movies: ['Beverly Hills Cop', 'Coming to America', 'Trading Places', 'Shrek', 'Dreamgirls'], wiki: 'Eddie Murphy', bio: 'Became one of the highest-grossing comedic stars in Hollywood history during the 1980s.' },
  { name: 'Michael J. Fox', industry: 'Hollywood', era: '1980s', epithet: 'Marty McFly', born: '9 Jun 1961', died: null, awards: 'Honorary Academy Award, 5 Emmys', movies: ['Back to the Future', 'Back to the Future Part II', 'Teen Wolf', 'Casualties of War'], wiki: 'Michael J. Fox', bio: 'Immortalized Marty McFly in Back to the Future and became an inspiring advocate.' },
  { name: 'Robin Williams', industry: 'Hollywood', era: '1980s', epithet: 'Comic & Dramatic Genius', born: '21 Jul 1951', died: '11 Aug 2014', awards: 'Academy Award, 6 Golden Globes', movies: ['Good Will Hunting', 'Dead Poets Society', 'Mrs. Doubtfire', 'Aladdin', 'Good Morning, Vietnam'], wiki: 'Robin Williams', bio: 'Unmatched improvisational brilliance paired with heartbreaking dramatic warmth.' },
  { name: 'Tom Hanks', industry: 'Hollywood', era: '1980s', epithet: "America's Dad", born: '9 Jul 1956', died: null, awards: '2 Consecutive Academy Awards', movies: ['Forrest Gump', 'Saving Private Ryan', 'Cast Away', 'Toy Story', 'Philadelphia'], wiki: 'Tom Hanks', bio: 'Back-to-back Best Actor Oscar winner beloved for timeless humanity on screen.' },
  { name: 'Bruce Willis', industry: 'Hollywood', era: '1980s', epithet: 'John McClane', born: '19 Mar 1955', died: null, awards: '2 Emmys, Golden Globe', movies: ['Die Hard', 'Pulp Fiction', 'The Sixth Sense', 'The Fifth Element', '12 Monkeys'], wiki: 'Bruce Willis', bio: 'Redefined the relatable everyman action hero in Die Hard.' },
  { name: 'Jackie Chan', industry: 'Hollywood', era: '1980s', epithet: 'Action Comedy King', born: '7 Apr 1954', died: null, awards: 'Honorary Academy Award', movies: ['Police Story', 'Drunken Master II', 'Rush Hour', 'Rumble in the Bronx'], wiki: 'Jackie Chan', bio: 'Honored with an Academy Award for pioneering acrobatic martial-arts slapstick.' },

  // 1990s
  { name: 'Shah Rukh Khan', industry: 'Bollywood', era: '1990s', epithet: 'King of Bollywood', born: '2 Nov 1965', died: null, awards: '14 Filmfare Awards, Padma Shri', movies: ['Dilwale Dulhania Le Jayenge', 'Kuch Kuch Hota Hai', 'Swades', 'Chak De! India', 'My Name Is Khan', 'Jawan', 'Pathaan'], wiki: 'Shah Rukh Khan', bio: 'Global phenomenon whose romantic and dramatic triumphs span three decades.' },
  { name: 'Salman Khan', industry: 'Bollywood', era: '1990s', epithet: 'Bhaijaan of Box Office', born: '27 Dec 1965', died: null, awards: '2 National Film Awards (Producer)', movies: ['Hum Aapke Hain Koun..!', 'Bajrangi Bhaijaan', 'Sultan', 'Dabangg', 'Tere Naam', 'Tiger Zinda Hai'], wiki: 'Salman Khan', bio: 'Unrivaled mass-entertainer whose films consistently shatter opening-day records.' },
  { name: 'Aamir Khan', industry: 'Bollywood', era: '1990s', epithet: 'Mr. Perfectionist', born: '14 Mar 1965', died: null, awards: '4 National Film Awards, 9 Filmfare Awards', movies: ['Lagaan', '3 Idiots', 'Dangal', 'Dil Chahta Hai', 'Taare Zameen Par', 'Rang De Basanti'], wiki: 'Aamir Khan', bio: 'Pioneer of content-driven blockbusters that broke global box-office records.' },
  { name: 'Kajol', industry: 'Bollywood', era: '1990s', epithet: 'Spontaneous Powerhouse', born: '5 Aug 1974', died: null, awards: '6 Filmfare Awards, Padma Shri', movies: ['Dilwale Dulhania Le Jayenge', 'Kuch Kuch Hota Hai', 'Kabhi Khushi Kabhie Gham', 'Gupt', 'Fanaa'], wiki: 'Kajol', bio: 'Famed for unfiltered emotion, electric chemistry, and five Best Actress Filmfare wins.' },
  { name: 'Madhuri Dixit', industry: 'Bollywood', era: '1990s', epithet: 'The Dhak Dhak Girl', born: '15 May 1967', died: null, awards: '6 Filmfare Awards, Padma Shri', movies: ['Hum Aapke Hain Koun..!', 'Dil To Pagal Hai', 'Devdas', 'Tezaab', 'Beta', 'Khalnayak'], wiki: 'Madhuri Dixit', bio: 'Crowned the queen of 1990s Bollywood with peerless dance grace and radiant charm.' },
  { name: 'Akshay Kumar', industry: 'Bollywood', era: '1990s', epithet: 'Khiladi Kumar', born: '9 Sep 1967', died: null, awards: 'National Film Award, Padma Shri', movies: ['Hera Pheri', 'Khiladi', 'Airlift', 'Special 26', 'Bhool Bhulaiyaa', 'Kesari'], wiki: 'Akshay Kumar', bio: 'Evolved from death-defying 90s stunt king to master of comedy and patriotic dramas.' },
  { name: 'Ajay Devgn', industry: 'Bollywood', era: '1990s', epithet: 'The Intense Titan', born: '2 Apr 1969', died: null, awards: '4 National Film Awards, Padma Shri', movies: ['Zakhm', 'The Legend of Bhagat Singh', 'Singham', 'Drishyam', 'Omkara', 'Tanhaji'], wiki: 'Ajay Devgn', bio: 'Four-time National Award winner celebrated for brooding intensity and action blockbusters.' },
  { name: 'Tabu', industry: 'Bollywood', era: '1990s', epithet: 'The Virtuoso', born: '4 Nov 1971', died: null, awards: '2 National Film Awards, 7 Filmfare Awards', movies: ['Maachis', 'Chandni Bar', 'Haider', 'Andhadhun', 'Drishyam', 'The Namesake'], wiki: 'Tabu (actress)', bio: 'Widely acclaimed as one of Indian cinema’s finest actors across every genre.' },
  { name: 'Aishwarya Rai Bachchan', industry: 'Bollywood', era: '1990s', epithet: 'Global Beauty Icon', born: '1 Nov 1973', died: null, awards: '2 Filmfare Awards, Padma Shri', movies: ['Hum Dil De Chuke Sanam', 'Devdas', 'Jodhaa Akbar', 'Guru', 'Taal', 'Ponniyin Selvan'], wiki: 'Aishwarya Rai Bachchan', bio: 'Miss World 1994 who became India’s most recognizable face at Cannes and worldwide.' },
  { name: 'Irrfan Khan', industry: 'Bollywood', era: '1990s', epithet: 'The Global Soul', born: '7 Jan 1967', died: '29 Apr 2020', awards: 'National Film Award, 6 Filmfare Awards', movies: ['The Lunchbox', 'Paan Singh Tomar', 'Maqbool', 'Life of Pi', 'Piku', 'Hindi Medium'], wiki: 'Irrfan Khan', bio: 'Spoke volumes with his eyes, beloved across Indian cinema and Hollywood blockbusters.' },
  { name: 'Leonardo DiCaprio', industry: 'Hollywood', era: '1990s', epithet: 'Titanic to The Revenant', born: '11 Nov 1974', died: null, awards: 'Academy Award, 7 Nominations', movies: ['Titanic', 'Inception', 'The Wolf of Wall Street', 'The Revenant', 'The Departed'], wiki: 'Leonardo DiCaprio', bio: 'Collaborated with Scorsese, Nolan, and Tarantino while remaining a rare original box-office draw.' },
  { name: 'Brad Pitt', industry: 'Hollywood', era: '1990s', epithet: 'Golden Screen Idol', born: '18 Dec 1963', died: null, awards: '2 Academy Awards (Actor & Producer)', movies: ['Fight Club', 'Se7en', 'Once Upon a Time in Hollywood', 'Inglourious Basterds', 'Moneyball'], wiki: 'Brad Pitt', bio: 'Matinee idol who thrived in daring, eccentric character roles and Oscar-winning productions.' },
  { name: 'Keanu Reeves', industry: 'Hollywood', era: '1990s', epithet: 'Neo & John Wick', born: '2 Sep 1964', died: null, awards: 'CinemaCon Vanguard Award', movies: ['The Matrix', 'John Wick', 'Speed', 'Point Break', 'Constantine'], wiki: 'Keanu Reeves', bio: 'Anchored two landmark action revolutions: The Matrix and John Wick.' },
  { name: 'Will Smith', industry: 'Hollywood', era: '1990s', epithet: 'King of Summer Blockbusters', born: '25 Sep 1968', died: null, awards: 'Academy Award, 4 Grammys', movies: ['Men in Black', 'Independence Day', 'The Pursuit of Happyness', 'Ali', 'King Richard'], wiki: 'Will Smith', bio: 'Dominated July 4th box offices for a decade before winning the Best Actor Oscar.' },
  { name: 'Jim Carrey', industry: 'Hollywood', era: '1990s', epithet: 'Rubber-Faced Genius', born: '17 Jan 1962', died: null, awards: '2 Golden Globes, BAFTA Nominee', movies: ['The Truman Show', 'Eternal Sunshine of the Spotless Mind', 'The Mask', 'Ace Ventura'], wiki: 'Jim Carrey', bio: 'Conquered 1994 comedy before delivering heartbreaking dramatic masterpieces.' },
  { name: 'Denzel Washington', industry: 'Hollywood', era: '1990s', epithet: 'The Gold Standard', born: '28 Dec 1954', died: null, awards: '2 Academy Awards, 10 Nominations', movies: ['Training Day', 'Malcolm X', 'Glory', 'Remember the Titans', 'Fences'], wiki: 'Denzel Washington', bio: 'Two-time Oscar winner revered for commanding authority and magnetic gravitas.' },
  { name: 'Julia Roberts', industry: 'Hollywood', era: '1990s', epithet: 'Pretty Woman', born: '28 Oct 1967', died: null, awards: 'Academy Award for Best Actress', movies: ['Pretty Woman', 'Erin Brockovich', 'Notting Hill', "My Best Friend's Wedding", "Ocean's Eleven"], wiki: 'Julia Roberts', bio: 'The reigning queen of 1990s romantic comedies and Best Actress Oscar winner.' },
  { name: 'Sandra Bullock', industry: 'Hollywood', era: '1990s', epithet: "America's Favorite", born: '26 Jul 1964', died: null, awards: 'Academy Award for Best Actress', movies: ['Speed', 'Gravity', 'The Blind Side', 'Miss Congeniality', 'The Proposal'], wiki: 'Sandra Bullock', bio: 'Effortlessly spans action thrillers, beloved comedies, and Oscar-winning dramas.' },
  { name: 'Morgan Freeman', industry: 'Hollywood', era: '1990s', epithet: 'Voice of Cinema', born: '1 Jun 1937', died: null, awards: 'Academy Award, AFI Life Achievement', movies: ['The Shawshank Redemption', 'Se7en', 'Million Dollar Baby', 'Unforgiven', 'The Dark Knight'], wiki: 'Morgan Freeman', bio: 'Immortalized Red in The Shawshank Redemption with warmth and dignity.' },
  { name: 'Kate Winslet', industry: 'Hollywood', era: '1990s', epithet: 'Titanic to Mare of Easttown', born: '5 Oct 1975', died: null, awards: 'Academy Award, 2 Emmys, Grammy', movies: ['Titanic', 'Eternal Sunshine of the Spotless Mind', 'The Reader', 'Sense and Sensibility'], wiki: 'Kate Winslet', bio: 'Youngest actress to earn six Oscar nominations, celebrated for fearless emotional depth.' },

  // 2000s
  { name: 'Hrithik Roshan', industry: 'Bollywood', era: '2000s', epithet: 'The Greek God of Bollywood', born: '10 Jan 1974', died: null, awards: '6 Filmfare Awards', movies: ['Kaho Naa... Pyaar Hai', 'Koi... Mil Gaya', 'Jodhaa Akbar', 'Zindagi Na Milegi Dobara', 'War', 'Super 30'], wiki: 'Hrithik Roshan', bio: 'Debuted with unprecedented overnight mania and set the gold standard for dance and action.' },
  { name: 'Kareena Kapoor Khan', industry: 'Bollywood', era: '2000s', epithet: 'Bebo', born: '21 Sep 1980', died: null, awards: '6 Filmfare Awards', movies: ['Jab We Met', 'Kabhi Khushi Kabhie Gham', 'Omkara', '3 Idiots', 'Bajrangi Bhaijaan', 'Crew'], wiki: 'Kareena Kapoor', bio: 'Immortalized Poo and Geet while effortlessly balancing commercial hits and bold dramas.' },
  { name: 'Priyanka Chopra Jonas', industry: 'Bollywood', era: '2000s', epithet: 'Desi Girl Gone Global', born: '18 Jul 1982', died: null, awards: 'National Film Award, 5 Filmfare Awards', movies: ['Barfi!', 'Fashion', 'Bajirao Mastani', 'Mary Kom', 'Don', 'The Sky Is Pink'], wiki: 'Priyanka Chopra', bio: 'Miss World 2000 and National Award winner who conquered both Bollywood and Hollywood.' },
  { name: 'Shahid Kapoor', industry: 'Bollywood', era: '2000s', epithet: 'Haider to Kabir Singh', born: '25 Feb 1981', died: null, awards: '3 Filmfare Awards', movies: ['Jab We Met', 'Haider', 'Kabir Singh', 'Udta Punjab', 'Kaminey', 'Padmaavat'], wiki: 'Shahid Kapoor', bio: 'Evolved from chocolate-boy hero into one of Bollywood’s most daring dramatic actors.' },
  { name: 'Katrina Kaif', industry: 'Bollywood', era: '2000s', epithet: 'Box Office Queen', born: '16 Jul 1983', died: null, awards: 'Zee Cine & Screen Awards', movies: ['Zindagi Na Milegi Dobara', 'Ek Tha Tiger', 'Namastey London', 'Raajneeti', 'Tiger Zinda Hai'], wiki: 'Katrina Kaif', bio: 'Dominated 2000s and 2010s blockbusters with dazzling dance numbers and spy-universe action.' },
  { name: 'Vidya Balan', industry: 'Bollywood', era: '2000s', epithet: 'Pioneer of Female-Led Hits', born: '1 Jan 1979', died: null, awards: 'National Film Award, 7 Filmfare Awards', movies: ['The Dirty Picture', 'Kahaani', 'Paa', 'Parineeta', 'Bhool Bhulaiyaa', 'Tumhari Sulu'], wiki: 'Vidya Balan', bio: 'Single-handedly ushered in a golden wave of woman-centric Indian blockbusters.' },
  { name: 'Farhan Akhtar', industry: 'Bollywood', era: '2000s', epithet: 'Renaissance Man', born: '9 Jan 1974', died: null, awards: 'National Film Award, 6 Filmfare Awards', movies: ['Bhaag Milkha Bhaag', 'Zindagi Na Milegi Dobara', 'Rock On!!', 'Dil Chahta Hai', 'Lakshya'], wiki: 'Farhan Akhtar', bio: 'Redefined modern Bollywood with Dil Chahta Hai before winning Best Actor for Bhaag Milkha Bhaag.' },
  { name: 'Kangana Ranaut', industry: 'Bollywood', era: '2000s', epithet: '4-Time National Award Winner', born: '23 Mar 1986', died: null, awards: '4 National Film Awards, Padma Shri', movies: ['Queen', 'Tanu Weds Manu', 'Fashion', 'Tanu Weds Manu Returns', 'Gangster'], wiki: 'Kangana Ranaut', bio: 'Four-time National Film Award winner celebrated for transformative performances.' },
  { name: 'Pankaj Tripathi', industry: 'Bollywood', era: '2000s', epithet: 'Kaleen Bhaiya & Everyday Genius', born: '5 Sep 1976', died: null, awards: '2 National Film Awards', movies: ['Gangs of Wasseypur', 'Stree', 'Mimi', 'Newton', 'Mirzapur', 'Ludo'], wiki: 'Pankaj Tripathi', bio: 'Effortless wit and grounded warmth that made him one of India’s most loved actors.' },
  { name: 'Nawazuddin Siddiqui', industry: 'Bollywood', era: '2000s', epithet: 'Faizal Khan Legend', born: '19 May 1974', died: null, awards: 'National Film Award Special Jury', movies: ['Gangs of Wasseypur', 'The Lunchbox', 'Bajrangi Bhaijaan', 'Manto', 'Sacred Games'], wiki: 'Nawazuddin Siddiqui', bio: 'Rose from bit parts to become an international icon of raw, realistic acting.' },
  { name: 'Christian Bale', industry: 'Hollywood', era: '2000s', epithet: 'The Dark Knight', born: '30 Jan 1974', died: null, awards: 'Academy Award, 4 Nominations', movies: ['The Dark Knight', 'American Psycho', 'The Fighter', 'The Prestige', 'Ford v Ferrari'], wiki: 'Christian Bale', bio: 'Famed for extreme physical transformations and anchoring Christopher Nolan’s Batman trilogy.' },
  { name: 'Heath Ledger', industry: 'Hollywood', era: '2000s', epithet: 'Immortal Joker', born: '4 Apr 1979', died: '22 Jan 2008', awards: 'Posthumous Academy Award', movies: ['The Dark Knight', 'Brokeback Mountain', '10 Things I Hate About You', "A Knight's Tale"], wiki: 'Heath Ledger', bio: 'Delivered two of the 21st century’s greatest performances in Brokeback Mountain and The Dark Knight.' },
  { name: 'Scarlett Johansson', industry: 'Hollywood', era: '2000s', epithet: 'Black Widow & Indie Muse', born: '22 Nov 1984', died: null, awards: 'BAFTA, Tony, 2 Oscar Nominations', movies: ['Lost in Translation', 'Marriage Story', 'The Avengers', 'Jojo Rabbit', 'Her'], wiki: 'Scarlett Johansson', bio: 'Highest-grossing box-office star of all time who also earned two Oscar nods in a single year.' },
  { name: 'Robert Downey Jr.', industry: 'Hollywood', era: '2000s', epithet: 'Iron Man & Oppenheimer', born: '4 Apr 1965', died: null, awards: 'Academy Award, BAFTA, 3 Golden Globes', movies: ['Iron Man', 'Avengers: Endgame', 'Oppenheimer', 'Sherlock Holmes', 'Tropic Thunder'], wiki: 'Robert Downey Jr.', bio: 'Launched the Marvel Cinematic Universe as Tony Stark and won the Oscar for Oppenheimer.' },
  { name: 'Anne Hathaway', industry: 'Hollywood', era: '2000s', epithet: 'Prada to Les Misérables', born: '12 Nov 1982', died: null, awards: 'Academy Award for Best Supporting Actress', movies: ['The Devil Wears Prada', 'Les Misérables', 'Interstellar', 'The Princess Diaries', 'The Dark Knight Rises'], wiki: 'Anne Hathaway', bio: 'Radiant versatility spanning fairy-tale comedy, sci-fi epics, and an Oscar-winning musical.' },
  { name: 'Hugh Jackman', industry: 'Hollywood', era: '2000s', epithet: 'Wolverine & Showman', born: '12 Oct 1968', died: null, awards: 'Emmy, Grammy, 2 Tonys, Oscar Nominee', movies: ['Logan', 'The Prestige', 'Les Misérables', 'The Greatest Showman', 'Deadpool & Wolverine'], wiki: 'Hugh Jackman', bio: 'Portrayed Wolverine for 24 years while shining on Broadway and in prestige dramas.' },
  { name: 'Natalie Portman', industry: 'Hollywood', era: '2000s', epithet: 'Black Swan Virtuoso', born: '9 Jun 1981', died: null, awards: 'Academy Award, 3 Nominations', movies: ['Black Swan', 'Léon: The Professional', 'V for Vendetta', 'Jackie'], wiki: 'Natalie Portman', bio: 'Harvard-educated Oscar winner celebrated for intense, fearless psychological roles.' },
  { name: 'Ryan Gosling', industry: 'Hollywood', era: '2000s', epithet: 'La La Land & Ken', born: '12 Nov 1980', died: null, awards: 'Golden Globe, 3 Oscar Nominations', movies: ['La La Land', 'Drive', 'Blade Runner 2049', 'Barbie', 'The Notebook'], wiki: 'Ryan Gosling', bio: 'Effortlessly cool in neo-noir thrillers and scene-stealing in La La Land and Barbie.' },
  { name: 'Charlize Theron', industry: 'Hollywood', era: '2000s', epithet: 'Furiosa & Monster', born: '7 Aug 1975', died: null, awards: 'Academy Award, 3 Nominations', movies: ['Mad Max: Fury Road', 'Monster', 'Atomic Blonde', 'Bombshell'], wiki: 'Charlize Theron', bio: 'Transformed completely for her Oscar in Monster and redefined modern action as Furiosa.' },
  { name: 'Joaquin Phoenix', industry: 'Hollywood', era: '2000s', epithet: 'Uncompromising Chameleon', born: '28 Oct 1974', died: null, awards: 'Academy Award, 4 Nominations', movies: ['Joker', 'Gladiator', 'Walk the Line', 'Her', 'The Master'], wiki: 'Joaquin Phoenix', bio: 'Fearless method performer who won the Best Actor Oscar for Joker.' },

  // 2010s–20s
  { name: 'Ranbir Kapoor', industry: 'Bollywood', era: '2010s–20s', epithet: 'The Modern Method Prince', born: '28 Sep 1982', died: null, awards: '7 Filmfare Awards', movies: ['Rockstar', 'Barfi!', 'Sanju', 'Animal', 'Yeh Jawaani Hai Deewani', 'Tamasha'], wiki: 'Ranbir Kapoor', bio: 'Celebrated for effortless emotional depth in Rockstar, Barfi!, and record-smashing Animal.' },
  { name: 'Deepika Padukone', industry: 'Bollywood', era: '2010s–20s', epithet: 'Queen of Modern Bollywood', born: '5 Jan 1986', died: null, awards: '3 Filmfare Awards, TIME100', movies: ['Padmaavat', 'Piku', 'Chennai Express', 'Yeh Jawaani Hai Deewani', 'Pathaan', 'Kalki 2898 AD'], wiki: 'Deepika Padukone', bio: 'Towering box-office powerhouse admired for regal period epics and intimate dramas.' },
  { name: 'Ranveer Singh', industry: 'Bollywood', era: '2010s–20s', epithet: 'The Electric Chameleon', born: '6 Jul 1985', died: null, awards: '5 Filmfare Awards', movies: ['Bajirao Mastani', 'Padmaavat', 'Gully Boy', 'Simmba', 'Rocky Aur Rani Kii Prem Kahaani'], wiki: 'Ranveer Singh', bio: 'Explosive energy and total transformation from Peshwa Bajirao to street rapper Murad.' },
  { name: 'Alia Bhatt', industry: 'Bollywood', era: '2010s–20s', epithet: 'Generational Virtuoso', born: '15 Mar 1993', died: null, awards: 'National Film Award, 6 Filmfare Awards', movies: ['Gangubai Kathiawadi', 'Raazi', 'Highway', 'Udta Punjab', 'Gully Boy', 'RRR'], wiki: 'Alia Bhatt', bio: 'Won the National Award for Gangubai Kathiawadi and set records for Filmfare Best Actress wins.' },
  { name: 'Vicky Kaushal', industry: 'Bollywood', era: '2010s–20s', epithet: 'Josh & Craftsmanship', born: '16 May 1988', died: null, awards: 'National Film Award, 4 Filmfare Awards', movies: ['Uri: The Surgical Strike', 'Sardar Udham', 'Masaan', 'Sam Bahadur', 'Raazi', 'Chhaava'], wiki: 'Vicky Kaushal', bio: 'Won a National Award for Uri and delivered landmark biographical performances.' },
  { name: 'Ayushmann Khurrana', industry: 'Bollywood', era: '2010s–20s', epithet: 'Champion of Content Cinema', born: '14 Sep 1984', died: null, awards: 'National Film Award, 4 Filmfare Awards', movies: ['Andhadhun', 'Vicky Donor', 'Badhaai Ho', 'Article 15', 'Dum Laga Ke Haisha', 'Dream Girl'], wiki: 'Ayushmann Khurrana', bio: 'Redefined mainstream Hindi stardom with socially bold, wildly entertaining hits.' },
  { name: 'Rajkummar Rao', industry: 'Bollywood', era: '2010s–20s', epithet: 'The Relentless Craftsman', born: '31 Aug 1984', died: null, awards: 'National Film Award, 4 Filmfare Awards', movies: ['Shahid', 'Stree', 'Stree 2', 'Newton', 'Bareilly Ki Barfi', 'Srikanth'], wiki: 'Rajkummar Rao', bio: 'National Award winner who headlined the historic horror-comedy blockbuster Stree 2.' },
  { name: 'Kiara Advani', industry: 'Bollywood', era: '2010s–20s', epithet: 'Shershaah Heartthrob', born: '31 Jul 1991', died: null, awards: 'IIFA & Zee Cine Awards', movies: ['Shershaah', 'Kabir Singh', 'Bhool Bhulaiyaa 2', 'Satyaprem Ki Katha', 'Good Newwz'], wiki: 'Kiara Advani', bio: 'Won hearts nationwide as Dimple in Shershaah and headlined back-to-back hits.' },
  { name: 'Kriti Sanon', industry: 'Bollywood', era: '2010s–20s', epithet: 'National Award Winner', born: '27 Jul 1990', died: null, awards: 'National Film Award, 2 Filmfare Awards', movies: ['Mimi', 'Bareilly Ki Barfi', 'Crew', 'Teri Baaton Mein Aisa Uljha Jiya', 'Luka Chuppi'], wiki: 'Kriti Sanon', bio: 'Won the National Film Award for Best Actress for her moving performance in Mimi.' },
  { name: 'Sushant Singh Rajput', industry: 'Bollywood', era: '2010s–20s', epithet: 'Forever in Our Stars', born: '21 Jan 1986', died: '14 Jun 2020', awards: 'Screen Award for Best Actor', movies: ['M.S. Dhoni: The Untold Story', 'Chhichhore', 'Kai Po Che!', 'Kedarnath', 'Detective Byomkesh Bakshy!'], wiki: 'Sushant Singh Rajput', bio: 'Brilliantly embodied M.S. Dhoni and left behind an unforgettable legacy of curiosity and heart.' },
  { name: 'Emma Stone', industry: 'Hollywood', era: '2010s–20s', epithet: '2-Time Best Actress Oscar Winner', born: '6 Nov 1988', died: null, awards: '2 Academy Awards for Best Actress', movies: ['La La Land', 'Poor Things', 'The Favourite', 'Easy A', 'Birdman', 'Cruella'], wiki: 'Emma Stone', bio: 'Won two Best Actress Academy Awards by age 35 for La La Land and Poor Things.' },
  { name: 'Timothée Chalamet', industry: 'Hollywood', era: '2010s–20s', epithet: 'Dune & Bob Dylan Virtuoso', born: '27 Dec 1995', died: null, awards: '2 Academy Award Nominations', movies: ['Dune: Part Two', 'Call Me by Your Name', 'A Complete Unknown', 'Little Women', 'Wonka'], wiki: 'Timothée Chalamet', bio: 'Generational leading man who anchored Dune and embodied Bob Dylan in A Complete Unknown.' },
  { name: 'Zendaya', industry: 'Hollywood', era: '2010s–20s', epithet: 'Chani, MJ & Emmy Queen', born: '1 Sep 1996', died: null, awards: '2 Emmy Awards, Golden Globe', movies: ['Dune: Part Two', 'Challengers', 'Spider-Man: No Way Home', 'The Greatest Showman', 'Euphoria'], wiki: 'Zendaya', bio: 'Two-time Emmy winner and fashion icon leading Dune and Challengers.' },
  { name: 'Margot Robbie', industry: 'Hollywood', era: '2010s–20s', epithet: 'Barbie & Tonya', born: '2 Jul 1990', died: null, awards: '3 Academy Award Nominations', movies: ['Barbie', 'I, Tonya', 'The Wolf of Wall Street', 'Once Upon a Time in Hollywood', 'Babylon'], wiki: 'Margot Robbie', bio: 'Starred in and produced the billion-dollar cultural phenomenon Barbie.' },
  { name: 'Cillian Murphy', industry: 'Hollywood', era: '2010s–20s', epithet: 'Oppenheimer & Tommy Shelby', born: '25 May 1976', died: null, awards: 'Academy Award, BAFTA, Golden Globe', movies: ['Oppenheimer', 'Inception', 'Dunkirk', '28 Days Later', 'Peaky Blinders'], wiki: 'Cillian Murphy', bio: 'Won the Best Actor Oscar for Christopher Nolan’s monumental Oppenheimer.' },
  { name: 'Florence Pugh', industry: 'Hollywood', era: '2010s–20s', epithet: 'Fearless Scene-Stealer', born: '3 Jan 1996', died: null, awards: 'Academy Award Nominee', movies: ['Little Women', 'Midsommar', 'Oppenheimer', 'Dune: Part Two', 'Black Widow'], wiki: 'Florence Pugh', bio: 'Electrifying emotional force across A24 horror, Little Women, and Dune.' },
  { name: 'Austin Butler', industry: 'Hollywood', era: '2010s–20s', epithet: 'Elvis & Feyd-Rautha', born: '17 Aug 1991', died: null, awards: 'BAFTA, Golden Globe, Oscar Nominee', movies: ['Elvis', 'Dune: Part Two', 'Once Upon a Time in Hollywood', 'The Bikeriders'], wiki: 'Austin Butler', bio: 'Earned an Oscar nomination for Elvis and delivered a chilling turn in Dune: Part Two.' },
  { name: 'Jennifer Lawrence', industry: 'Hollywood', era: '2010s–20s', epithet: 'Katniss & Oscar Winner', born: '15 Aug 1990', died: null, awards: 'Academy Award, 4 Nominations', movies: ['Silver Linings Playbook', 'The Hunger Games', "Winter's Bone", 'American Hustle'], wiki: 'Jennifer Lawrence', bio: 'Won the Best Actress Oscar at 22 while leading The Hunger Games phenomenon.' },
  { name: 'Pedro Pascal', industry: 'Hollywood', era: '2010s–20s', epithet: 'The Mandalorian & Joel', born: '2 Apr 1975', died: null, awards: 'SAG Award, 3 Emmy Nominations', movies: ['Gladiator II', 'The Unbearable Weight of Massive Talent', 'Kingsman: The Golden Circle'], wiki: 'Pedro Pascal', bio: 'Beloved global star of The Last of Us, The Mandalorian, and Gladiator II.' },
  { name: 'Viola Davis', industry: 'Hollywood', era: '2010s–20s', epithet: 'EGOT Titan', born: '11 Aug 1965', died: null, awards: 'EGOT Winner (Oscar, Emmy, Grammy, 2 Tonys)', movies: ['Fences', 'The Help', 'The Woman King', "Ma Rainey's Black Bottom", 'Widows'], wiki: 'Viola Davis', bio: 'Achieved the rare EGOT status with shattering dramatic power.' }
];

const PLANET_THEMES = [
  { name: 'Jupiter', icon: '🪐', base: '#c88b3a', band1: '#8f4e22', band2: '#ebd3b0', band3: '#b36b32', glow: 0xf59e0b, hasRings: false },
  { name: 'Saturn',  icon: '🪐', base: '#e5cf9f', band1: '#bfa36f', band2: '#f6ead0', band3: '#d4b886', glow: 0xfde047, hasRings: true  },
  { name: 'Uranus',  icon: '🔵', base: '#67d8eb', band1: '#42b8d1', band2: '#aaf0fc', band3: '#53c7df', glow: 0x38bdf8, hasRings: false },
  { name: 'Neptune', icon: '🌀', base: '#2b52d9', band1: '#1b369e', band2: '#5e85ff', band3: '#3561eb', glow: 0x60a5fa, hasRings: false },
  { name: 'Pluto',   icon: '❄️', base: '#9e8574', band1: '#6e584a', band2: '#e8dcd3', band3: '#b59d8c', glow: 0xc084fc, hasRings: false }
];

function isValidPhotoUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase();
  return (
    !lower.endsWith('.svg') &&
    !lower.endsWith('.svg.png') &&
    !lower.includes('flag_of_') &&
    !lower.includes('commons-logo') &&
    !lower.includes('symbol_') &&
    !lower.includes('question_book') &&
    !lower.includes('ambox_')
  );
}

function latLonToVec3(latDeg, lonDeg, radius) {
  const phi = THREE.MathUtils.degToRad(90 - latDeg);
  const theta = THREE.MathUtils.degToRad(lonDeg + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function createStarGlowSpriteTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.22, 'rgba(255, 255, 255, 0.85)');
  grad.addColorStop(0.55, 'rgba(210, 230, 255, 0.25)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

function createNebulaCloudTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 124);
  grad.addColorStop(0, 'rgba(130, 170, 255, 0.22)');
  grad.addColorStop(0.45, 'rgba(95, 115, 210, 0.09)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

function createAsteroidRockTextures() {
  const size = 256;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const cCtx = colorCanvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d');

  cCtx.fillStyle = '#5c5852';
  cCtx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);

  // Mineral grain & regolith speckles
  for (let i = 0; i < 1800; i++) {
    const x = (i * 73) % size;
    const y = (i * 137) % size;
    const r = 1 + (i % 3);
    const shade = 65 + (i % 65);
    cCtx.fillStyle = `rgb(${shade + 6}, ${shade + 2}, ${shade - 4})`;
    cCtx.fillRect(x, y, r, r);

    const bShade = 95 + (i % 70);
    bCtx.fillStyle = `rgb(${bShade}, ${bShade}, ${bShade})`;
    bCtx.fillRect(x, y, r, r);
  }

  // Impact craters with raised rims
  for (let c = 0; c < 28; c++) {
    const cx = (c * 89 + 23) % size;
    const cy = (c * 61 + 41) % size;
    const cr = 6 + (c % 18);

    const rimGrad = bCtx.createRadialGradient(cx, cy, cr * 0.4, cx, cy, cr * 1.25);
    rimGrad.addColorStop(0, '#353535');
    rimGrad.addColorStop(0.75, '#707070');
    rimGrad.addColorStop(0.9, '#d0d0d0');
    rimGrad.addColorStop(1, 'rgba(128,128,128,0)');
    bCtx.fillStyle = rimGrad;
    bCtx.beginPath();
    bCtx.arc(cx, cy, cr * 1.25, 0, Math.PI * 2);
    bCtx.fill();

    cCtx.fillStyle = 'rgba(32, 30, 28, 0.42)';
    cCtx.beginPath();
    cCtx.arc(cx, cy, cr * 0.85, 0, Math.PI * 2);
    cCtx.fill();
  }

  return {
    map: new THREE.CanvasTexture(colorCanvas),
    bumpMap: new THREE.CanvasTexture(bumpCanvas)
  };
}

function createCometTailTexture(innerRgba, midRgba) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const lenGrad = ctx.createLinearGradient(0, 0, 0, 512);
  lenGrad.addColorStop(0, innerRgba);
  lenGrad.addColorStop(0.32, midRgba);
  lenGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = lenGrad;
  ctx.fillRect(0, 0, 128, 512);

  // Soft lateral feathering so tail edges dissolve naturally into space
  ctx.globalCompositeOperation = 'destination-in';
  const sideGrad = ctx.createLinearGradient(0, 0, 128, 0);
  sideGrad.addColorStop(0, 'rgba(0,0,0,0)');
  sideGrad.addColorStop(0.5, 'rgba(0,0,0,1)');
  sideGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = sideGrad;
  ctx.fillRect(0, 0, 128, 512);

  return new THREE.CanvasTexture(canvas);
}

function createPlanetTextures(theme) {
  const W = 1024;
  const H = 512;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = W;
  bumpCanvas.height = H;
  const bCtx = bumpCanvas.getContext('2d');

  ctx.fillStyle = theme.base;
  ctx.fillRect(0, 0, W, H);
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, W, H);

  const palette = [theme.base, theme.band1, theme.band2, theme.band3];

  for (let y = 0; y < H; y += 3) {
    const latNorm = y / H;
    const zoneIdx =
      Math.floor(Math.abs(Math.sin(latNorm * 14 + Math.cos(latNorm * 6) * 0.6)) * palette.length) %
      palette.length;
    ctx.fillStyle = palette[zoneIdx];
    ctx.globalAlpha = 0.28 + 0.22 * Math.sin(y * 0.08);
    ctx.fillRect(0, y, W, 4);

    const bumpVal = 115 + Math.floor(Math.sin(latNorm * 28) * 28);
    bCtx.fillStyle = `rgb(${bumpVal},${bumpVal},${bumpVal})`;
    bCtx.fillRect(0, y, W, 3);
  }

  for (let i = 0; i < 420; i++) {
    const x = (i * 97) % W;
    const y = (i * 53) % H;
    const w = 45 + (i % 90);
    const h = 4 + (i % 10);
    ctx.fillStyle = palette[i % palette.length];
    ctx.globalAlpha = 0.14;
    ctx.beginPath();
    ctx.ellipse(x, y + Math.sin(x * 0.02) * 5, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;

  if (theme.name === 'Jupiter') {
    const spotGrad = ctx.createRadialGradient(640, 325, 6, 640, 325, 48);
    spotGrad.addColorStop(0, '#b83b22');
    spotGrad.addColorStop(0.65, '#d6643a');
    spotGrad.addColorStop(1, 'rgba(214, 100, 58, 0)');
    ctx.fillStyle = spotGrad;
    ctx.beginPath();
    ctx.ellipse(640, 325, 52, 30, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (theme.name === 'Neptune') {
    const darkGrad = ctx.createRadialGradient(420, 290, 4, 420, 290, 36);
    darkGrad.addColorStop(0, '#10216b');
    darkGrad.addColorStop(1, 'rgba(16, 33, 107, 0)');
    ctx.fillStyle = darkGrad;
    ctx.beginPath();
    ctx.ellipse(420, 290, 38, 22, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (theme.name === 'Pluto') {
    ctx.fillStyle = 'rgba(248, 242, 236, 0.72)';
    ctx.beginPath();
    ctx.ellipse(520, 265, 76, 62, -0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  const poleGrad = ctx.createLinearGradient(0, 0, 0, H);
  poleGrad.addColorStop(0, 'rgba(8, 12, 28, 0.45)');
  poleGrad.addColorStop(0.18, 'rgba(8, 12, 28, 0)');
  poleGrad.addColorStop(0.82, 'rgba(8, 12, 28, 0)');
  poleGrad.addColorStop(1, 'rgba(8, 12, 28, 0.45)');
  ctx.fillStyle = poleGrad;
  ctx.fillRect(0, 0, W, H);

  return {
    map: new THREE.CanvasTexture(canvas),
    bumpMap: new THREE.CanvasTexture(bumpCanvas)
  };
}

function createStarCardTexture(star, preloadedImg, maxAnisotropy = 8, frameIndex = 1) {
  const W = 512;
  const H = 640;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const isBolly = star.industry === 'Bollywood';

  // Dark 35mm celluloid filmstrip base
  ctx.fillStyle = '#07080d';
  ctx.fillRect(0, 0, W, H);

  // Subtle metallic filmstrip side rails
  const railW = 46;
  ctx.fillStyle = '#0c0e16';
  ctx.fillRect(0, 0, railW, H);
  ctx.fillRect(W - railW, 0, railW, H);

  // Inner photo viewport bounds (framed inside the filmstrip)
  const photoX = railW + 8;
  const photoY = 26;
  const photoW = W - (railW + 8) * 2;
  const photoH = H - 156;

  const grad = ctx.createLinearGradient(photoX, photoY, photoX + photoW, photoY + photoH);
  grad.addColorStop(0, isBolly ? '#241206' : '#071e2e');
  grad.addColorStop(1, '#04060c');
  ctx.fillStyle = grad;
  ctx.fillRect(photoX, photoY, photoW, photoH);

  // Clip and draw portrait with gentle tone-balancing so it isn't overly bright on the 3D globe
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, 8);
  ctx.clip();

  if (preloadedImg && preloadedImg.complete && preloadedImg.naturalWidth > 0) {
    const scale = Math.max(photoW / preloadedImg.naturalWidth, photoH / preloadedImg.naturalHeight);
    const w = preloadedImg.naturalWidth * scale;
    const h = preloadedImg.naturalHeight * scale;
    ctx.filter = 'brightness(0.84) contrast(1.08) saturate(0.95)';
    ctx.drawImage(preloadedImg, photoX + (photoW - w) / 2, photoY, w, h);
    ctx.filter = 'none';
  } else {
    const initials = star.name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('');
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = 'bold 124px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, W / 2, photoY + photoH * 0.48);
  }

  // Soft anti-glare cinema vignette overlay
  const vignette = ctx.createRadialGradient(
    W / 2,
    photoY + photoH * 0.45,
    photoW * 0.25,
    W / 2,
    photoY + photoH * 0.5,
    photoH * 0.72
  );
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(3, 5, 12, 0.42)');
  ctx.fillStyle = vignette;
  ctx.fillRect(photoX, photoY, photoW, photoH);
  ctx.restore();

  // Inner film gate hairline border
  ctx.strokeStyle = isBolly ? 'rgba(245, 158, 11, 0.55)' : 'rgba(56, 189, 248, 0.55)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, 8);
  ctx.stroke();

  // Perforated 35mm sprocket holes along left and right film rails
  const holeW = 22;
  const holeH = 30;
  const holeRadius = 5;
  const totalHoles = 8;
  const spacing = H / totalHoles;
  for (let i = 0; i < totalHoles; i++) {
    const hy = i * spacing + (spacing - holeH) / 2;
    // Left sprocket hole
    ctx.fillStyle = '#010205';
    ctx.beginPath();
    ctx.roundRect((railW - holeW) / 2, hy, holeW, holeH, holeRadius);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Right sprocket hole
    ctx.fillStyle = '#010205';
    ctx.beginPath();
    ctx.roundRect(W - railW + (railW - holeW) / 2, hy, holeW, holeH, holeRadius);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Top filmstock code & frame counter
  ctx.fillStyle = 'rgba(251, 191, 36, 0.65)';
  ctx.font = '600 13px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`KODAK 5219 • ${String(frameIndex).padStart(4, '0')}A`, photoX + 4, 17);
  ctx.textAlign = 'right';
  ctx.fillText('35MM', W - photoX - 4, 17);

  // Caption strip below the film frame
  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'bold 34px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(star.name, W / 2, H - 76, photoW - 12);

  ctx.fillStyle = isBolly ? '#fbbf24' : '#38bdf8';
  ctx.font = '700 22px Inter, sans-serif';
  ctx.fillText(`${star.industry.toUpperCase()} • ${star.era}`, W / 2, H - 36, photoW - 12);

  // Subtle horizontal divider lines separating consecutive reel frames
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.fillRect(0, 0, W, 3);
  ctx.fillRect(0, H - 3, W, 3);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = maxAnisotropy;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  return tex;
}

export default function App() {
  const [stars, setStars] = useState(() => INITIAL_STARS.map((s) => ({ ...s, photoUrl: null })));
  const [bootProgress, setBootProgress] = useState(0);
  const [bootStage, setBootStage] = useState('Initializing Cinema Galaxy...');
  const [isSceneReady, setIsSceneReady] = useState(false);

  const [activeIndustry, setActiveIndustry] = useState('ALL');
  const [activeEra, setActiveEra] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [planetIndex, setPlanetIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(18.5);

  const [hoveredInfo, setHoveredInfo] = useState(null);
  const [selectedStarIdx, setSelectedStarIdx] = useState(null);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [dirFilterMode, setDirFilterMode] = useState('ALL');
  const [editingStarIdx, setEditingStarIdx] = useState(null);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [copiedNotice, setCopiedNotice] = useState(false);

  const containerRef = useRef(null);
  const imageCacheRef = useRef(new Map());
  const sceneRefs = useRef({
    scene: null,
    camera: null,
    renderer: null,
    globeGroup: null,
    coreMesh: null,
    atmosphereMesh: null,
    ringGroup: null,
    starField: null,
    cardMeshes: [],
    comets: [],
    asteroids: [],
    dheerajShip: null,
    allStarsShip: null,
    hoveredMesh: null,
    isDragging: false,
    prevPointer: { x: 0, y: 0 },
    targetRotationY: 0,
    targetRotationX: 0.12
  });

  const isAutoRotatingRef = useRef(isAutoRotating);
  useEffect(() => {
    isAutoRotatingRef.current = isAutoRotating;
  }, [isAutoRotating]);

  const starsRef = useRef(stars);
  useEffect(() => {
    starsRef.current = stars;
  }, [stars]);

  const preloadImageElement = useCallback((url) => {
    if (!isValidPhotoUrl(url)) return Promise.resolve(null);
    if (imageCacheRef.current.has(url)) {
      return Promise.resolve(imageCacheRef.current.get(url));
    }
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      const timer = setTimeout(() => resolve(null), 5500);
      img.onload = () => {
        clearTimeout(timer);
        imageCacheRef.current.set(url, img);
        resolve(img);
      };
      img.onerror = () => {
        clearTimeout(timer);
        resolve(null);
      };
      img.src = url;
    });
  }, []);

  const hydrateAllPortraits = useCallback(
    async (roster, onProgress) => {
      const updated = roster.map((s) => ({ ...s }));
      const total = updated.length;
      let completed = 0;

      const tick = (stageText) => {
        completed++;
        if (onProgress) {
          onProgress(Math.min(95, Math.round((completed / total) * 90)), stageText);
        }
      };

      // Step 1: Batched English Wikipedia pageimages lookup
      const BATCH_SIZE = 48;
      const missingIndices = [];

      for (let i = 0; i < updated.length; i += BATCH_SIZE) {
        const batchIndices = [];
        for (let j = i; j < Math.min(i + BATCH_SIZE, updated.length); j++) {
          if (!isValidPhotoUrl(updated[j].photoUrl)) batchIndices.push(j);
        }
        if (batchIndices.length === 0) continue;

        const titles = batchIndices.map((idx) => updated[idx].wiki || updated[idx].name);
        const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
          titles.join('|')
        )}&prop=pageimages&pilicense=any&pithumbsize=440&redirects=1&format=json&origin=*`;

        try {
          const res = await fetch(url);
          const data = await res.json();
          const pages = data?.query?.pages || {};
          const redirects = data?.query?.redirects || [];
          const normalized = data?.query?.normalized || [];
          const map = {};

          Object.values(pages).forEach((p) => {
            if (p.title && isValidPhotoUrl(p.thumbnail?.source)) {
              map[p.title.toLowerCase()] = p.thumbnail.source;
            }
          });
          redirects.forEach((r) => {
            if (map[r.to.toLowerCase()]) map[r.from.toLowerCase()] = map[r.to.toLowerCase()];
          });
          normalized.forEach((n) => {
            if (map[n.to.toLowerCase()]) map[n.from.toLowerCase()] = map[n.to.toLowerCase()];
          });

          await Promise.all(
            batchIndices.map(async (idx) => {
              const star = updated[idx];
              const key = (star.wiki || star.name).toLowerCase();
              const found = map[key] || map[star.name.toLowerCase()];
              if (found) {
                const imgEl = await preloadImageElement(found);
                if (imgEl) {
                  star.photoUrl = found;
                  tick(`Hydrating portraits (${completed}/${total})...`);
                  return;
                }
              }
              missingIndices.push(idx);
            })
          );
        } catch {
          missingIndices.push(...batchIndices);
        }
      }

      // Step 2: Multi-source fallback (Wikidata P18 -> Hindi Wikipedia -> Wikimedia Commons)
      const resolveSingleFallback = async (star) => {
        try {
          const wdSearch = await fetch(
            `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(
              star.name
            )}&language=en&limit=2&format=json&origin=*`
          ).then((r) => r.json());
          const qids = (wdSearch?.search || []).map((item) => item.id).filter(Boolean);
          if (qids.length > 0) {
            const wdClaims = await fetch(
              `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qids.join(
                '|'
              )}&props=claims&format=json&origin=*`
            ).then((r) => r.json());
            for (const qid of qids) {
              const p18 = wdClaims?.entities?.[qid]?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
              if (p18 && isValidPhotoUrl(p18)) {
                return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(p18)}?width=260`;
              }
            }
          }
        } catch {
          // Continue fallback
        }

        try {
          const query = `${star.name} ${star.industry === 'Bollywood' ? 'actor India' : 'actor'}`;
          const searchData = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
              query
            )}&gsrlimit=4&prop=pageimages&pilicense=any&pithumbsize=260&format=json&origin=*`
          ).then((r) => r.json());
          const match = Object.values(searchData?.query?.pages || {}).find((p) => isValidPhotoUrl(p.thumbnail?.source));
          if (match) return match.thumbnail.source;
        } catch {
          // Continue fallback
        }

        if (star.industry === 'Bollywood') {
          try {
            const hiData = await fetch(
              `https://hi.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
                star.name
              )}&gsrlimit=4&prop=pageimages&pilicense=any&pithumbsize=260&format=json&origin=*`
            ).then((r) => r.json());
            const hiMatch = Object.values(hiData?.query?.pages || {}).find((p) => isValidPhotoUrl(p.thumbnail?.source));
            if (hiMatch) return hiMatch.thumbnail.source;
          } catch {
            // Continue fallback
          }
        }

        try {
          const cData = await fetch(
            `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
              `"${star.name}"`
            )}&gsrnamespace=6&gsrlimit=4&prop=imageinfo&iiprop=url&iiurlwidth=260&format=json&origin=*`
          ).then((r) => r.json());
          const cMatch = Object.values(cData?.query?.pages || {}).find((p) => isValidPhotoUrl(p.imageinfo?.[0]?.thumburl));
          if (cMatch) return cMatch.imageinfo[0].thumburl;
        } catch {
          // Ignore
        }

        return null;
      };

      for (let i = 0; i < missingIndices.length; i += 6) {
        const chunk = missingIndices.slice(i, i + 6);
        await Promise.all(
          chunk.map(async (idx) => {
            const star = updated[idx];
            const found = await resolveSingleFallback(star);
            if (found) {
              const imgEl = await preloadImageElement(found);
              if (imgEl) star.photoUrl = found;
            }
            tick(`Resolving archival portraits (${completed}/${total})...`);
          })
        );
      }

      return updated;
    },
    [preloadImageElement]
  );

  // Preload core curated portraits before revealing the 3D globe, then expand to 1,002 stars
  useEffect(() => {
    let cancelled = false;

    const bootCinemaGalaxy = async () => {
      setBootStage('Fetching Bollywood & Hollywood Star Portraits...');
      setBootProgress(12);

      const hydratedCore = await hydrateAllPortraits(INITIAL_STARS, (pct, stage) => {
        if (!cancelled) {
          setBootProgress(pct);
          if (stage) setBootStage(stage);
        }
      });

      if (cancelled) return;
      setBootStage('Assembling 3D Planetary Territories & Starfield...');
      setBootProgress(96);
      setStars(hydratedCore);

      requestAnimationFrame(() => {
        setTimeout(() => {
          if (!cancelled) {
            setBootProgress(100);
            setIsSceneReady(true);
          }
        }, 260);
      });

      // Continue expanding seamlessly in the background up to 1,002 verified-photo stars
      const TARGET_TOTAL = 1002;
      const existingNames = new Set(hydratedCore.map((s) => s.name.toLowerCase()));
      const eras = ['1950s–60s', '1970s', '1980s', '1990s', '2000s', '2010s–20s'];

      const wikiCategories = [
        { cat: 'Category:Hindi_film_actors', industry: 'Bollywood' },
        { cat: 'Category:Hindi_film_actresses', industry: 'Bollywood' },
        { cat: 'Category:20th-century_Indian_male_actors', industry: 'Bollywood' },
        { cat: 'Category:20th-century_Indian_actresses', industry: 'Bollywood' },
        { cat: 'Category:21st-century_Indian_male_actors', industry: 'Bollywood' },
        { cat: 'Category:21st-century_Indian_actresses', industry: 'Bollywood' },
        { cat: 'Category:American_male_film_actors', industry: 'Hollywood' },
        { cat: 'Category:American_film_actresses', industry: 'Hollywood' },
        { cat: 'Category:English_male_film_actors', industry: 'Hollywood' },
        { cat: 'Category:English_film_actresses', industry: 'Hollywood' },
        { cat: 'Category:Academy_Award_for_Best_Actor_winners', industry: 'Hollywood' },
        { cat: 'Category:Academy_Award_for_Best_Actress_winners', industry: 'Hollywood' }
      ];

      const inferEraFromText = (text, fallbackIdx) => {
        const yearMatches = (text || '').match(/\b(19[3-9]\d|20[0-2]\d)\b/g);
        if (yearMatches && yearMatches.length > 0) {
          const years = yearMatches.map(Number).filter((y) => y >= 1945 && y <= 2026);
          const sorted = years.sort((a, b) => a - b);
          const refYear = sorted[0] < 1945 ? sorted[0] + 30 : sorted.length > 1 ? sorted[1] : sorted[0] + 25;
          if (refYear < 1970) return '1950s–60s';
          if (refYear < 1980) return '1970s';
          if (refYear < 1990) return '1980s';
          if (refYear < 2000) return '1990s';
          if (refYear < 2010) return '2000s';
          return '2010s–20s';
        }
        return eras[fallbackIdx % eras.length];
      };

      const candidates = [];
      for (const src of wikiCategories) {
        if (cancelled || candidates.length >= 1600) break;
        try {
          const catUrl = `https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=${encodeURIComponent(
            src.cat
          )}&cmnamespace=0&cmlimit=180&format=json&origin=*`;
          const res = await fetch(catUrl);
          const data = await res.json();
          const members = (data?.query?.categorymembers || []).map((m) => m.title);
          for (const rawTitle of members) {
            const cleanName = rawTitle.replace(/\s*\(.*?\)\s*/g, '').trim();
            if (
              !cleanName ||
              cleanName.length < 3 ||
              cleanName.startsWith('List of') ||
              existingNames.has(cleanName.toLowerCase())
            ) {
              continue;
            }
            existingNames.add(cleanName.toLowerCase());
            candidates.push({ name: cleanName, wiki: rawTitle, industry: src.industry });
          }
        } catch {
          // Ignore individual category network hiccups
        }
      }

      const fullRoster = [...hydratedCore];
      for (let i = 0; i < candidates.length && fullRoster.length < TARGET_TOTAL && !cancelled; i += 45) {
        const slice = candidates.slice(i, i + 45);
        try {
          const detailUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
            slice.map((c) => c.wiki).join('|')
          )}&prop=pageimages|extracts&pilicense=any&pithumbsize=440&exintro=1&explaintext=1&exsentences=2&redirects=1&format=json&origin=*`;
          const res = await fetch(detailUrl);
          const data = await res.json();
          const pages = Object.values(data?.query?.pages || {});

          const newlyAdded = [];
          await Promise.all(
            slice.map(async (c) => {
              if (fullRoster.length + newlyAdded.length >= TARGET_TOTAL) return;
              const page = pages.find(
                (p) =>
                  p.title &&
                  (p.title.toLowerCase() === c.wiki.toLowerCase() ||
                    p.title.toLowerCase().startsWith(c.name.toLowerCase()))
              );
              const thumbSrc = page?.thumbnail?.source;
              if (!isValidPhotoUrl(thumbSrc)) return;

              const imgEl = await preloadImageElement(thumbSrc);
              if (!imgEl) return;

              const extract = page?.extract || '';
              const bornMatch = extract.match(/\bborn\s+([A-Z][a-z]+\s+\d{1,2},\s+\d{4}|\d{1,2}\s+[A-Z][a-z]+\s+\d{4})/);
              const diedMatch = extract.match(/[–-]\s*([A-Z][a-z]+\s+\d{1,2},\s+\d{4}|\d{1,2}\s+[A-Z][a-z]+\s+\d{4})/);
              const era = inferEraFromText(extract, fullRoster.length + newlyAdded.length);

              newlyAdded.push({
                name: c.name,
                industry: c.industry,
                era,
                epithet: c.industry === 'Bollywood' ? 'Indian Cinema Luminary' : 'Hollywood Screen Icon',
                born: bornMatch ? bornMatch[1] : 'Cinema Archive',
                died: diedMatch ? diedMatch[1] : null,
                awards: c.industry === 'Bollywood' ? 'Indian Cinema Honoree' : 'International Screen Honoree',
                movies: ['Classic Feature', 'Acclaimed Drama', 'Box Office Hit', 'Signature Role'],
                wiki: c.wiki,
                photoUrl: thumbSrc,
                bio:
                  extract.length > 25
                    ? extract.slice(0, 220) + (extract.length > 220 ? '...' : '')
                    : `Celebrated ${c.industry} performer featured in the ${era} territory of Cinema Galaxy.`
              });
            })
          );

          if (newlyAdded.length > 0 && !cancelled) {
            fullRoster.push(...newlyAdded);
            setStars([...fullRoster]);
          }
        } catch {
          // Continue to next batch
        }
      }
    };

    bootCinemaGalaxy();
    return () => {
      cancelled = true;
    };
  }, [hydrateAllPortraits, preloadImageElement]);

  // Initialize Three.js Scene once
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0.8, 18.5);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Realistic astronomical solar + starlight illumination
    const ambientLight = new THREE.AmbientLight(0x9bb4d8, 0.62);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e4, 1.55);
    keyLight.position.set(18, 14, 22);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x3b82f6, 0.55);
    rimLight.position.set(-18, -12, -16);
    scene.add(rimLight);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Planet Core, Atmosphere Halo, Planetary Rings & Decade Country Borders
    const initTheme = PLANET_THEMES[0];
    const initTextures = createPlanetTextures(initTheme);
    const coreMesh = new THREE.Mesh(
      new THREE.SphereGeometry(5.6, 64, 64),
      new THREE.MeshStandardMaterial({
        map: initTextures.map,
        bumpMap: initTextures.bumpMap,
        bumpScale: 0.08,
        roughness: 0.58,
        metalness: 0.08
      })
    );
    globeGroup.add(coreMesh);

    const atmosphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(5.95, 48, 48),
      new THREE.MeshBasicMaterial({
        color: initTheme.glow,
        transparent: true,
        opacity: 0.14,
        side: THREE.BackSide
      })
    );
    globeGroup.add(atmosphereMesh);

    const ringGroup = new THREE.Group();
    const ringGeom = new THREE.RingGeometry(6.8, 8.9, 64);
    ringGeom.rotateX(Math.PI / 2.3);
    ringGroup.add(
      new THREE.Mesh(
        ringGeom,
        new THREE.MeshBasicMaterial({
          color: 0xfde68a,
          transparent: true,
          opacity: 0.16,
          side: THREE.DoubleSide
        })
      )
    );
    scene.add(ringGroup);

    DECADE_COUNTRIES.forEach((country) => {
      const halfLon = country.lonSpan / 2;
      const halfLat = country.latSpan / 2;
      const pts = [];
      const steps = 20;
      const R = 6.08;
      for (let i = 0; i <= steps; i++) pts.push(latLonToVec3(country.latCenter + halfLat, country.lonCenter - halfLon + (country.lonSpan * i) / steps, R));
      for (let i = 0; i <= steps; i++) pts.push(latLonToVec3(country.latCenter + halfLat - (country.latSpan * i) / steps, country.lonCenter + halfLon, R));
      for (let i = 0; i <= steps; i++) pts.push(latLonToVec3(country.latCenter - halfLat, country.lonCenter + halfLon - (country.lonSpan * i) / steps, R));
      for (let i = 0; i <= steps; i++) pts.push(latLonToVec3(country.latCenter - halfLat + (country.latSpan * i) / steps, country.lonCenter - halfLon, R));
      globeGroup.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts),
          new THREE.LineBasicMaterial({ color: country.color, transparent: true, opacity: 0.5 })
        )
      );
    });

    // Realistic Deep-Space Milky Way Galaxy & Volumetric Nebula Clouds
    const starGlowTex = createStarGlowSpriteTexture();
    const nebulaTex = createNebulaCloudTexture();

    const starCount = 6500;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    // Realistic astronomical stellar spectral classes (O, B, A, F, G, K, M)
    const spectralPalette = [
      new THREE.Color(0xcad8ff), // O/B blue-white giant
      new THREE.Color(0xf8f7ff), // A white star
      new THREE.Color(0xfff4e8), // F yellow-white
      new THREE.Color(0xffe6b8), // G solar-type
      new THREE.Color(0xffcfa1), // K orange giant
      new THREE.Color(0xffb48a), // M red supergiant
      new THREE.Color(0x9ec5ff)  // Hot blue star
    ];

    for (let i = 0; i < starCount; i++) {
      let x, y, z;
      if (i < 4200) {
        const arm = i % 4;
        const radius = 14 + Math.pow(Math.random(), 0.85) * 95;
        const spinAngle = radius * 0.11 + (arm * Math.PI * 2) / 4;
        const spread = (Math.random() - 0.5) * (4.5 + radius * 0.08);
        x = Math.cos(spinAngle) * radius + spread;
        y = (Math.random() - 0.5) * (3.5 + radius * 0.05);
        z = Math.sin(spinAngle) * radius + spread;
      } else {
        const r = 40 + Math.random() * 140;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.cos(phi);
        z = r * Math.sin(phi) * Math.sin(theta);
      }
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const c = spectralPalette[i % spectralPalette.length];
      const brightness = 0.55 + Math.random() * 0.45;
      colors[i * 3] = c.r * brightness;
      colors[i * 3 + 1] = c.g * brightness;
      colors[i * 3 + 2] = c.b * brightness;
    }

    const starGeom = new THREE.BufferGeometry();
    starGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const starField = new THREE.Points(
      starGeom,
      new THREE.PointsMaterial({
        size: 0.62,
        map: starGlowTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    starField.rotation.x = 0.36;
    starField.rotation.z = -0.18;
    scene.add(starField);

    // Subtle Galactic Dust & Nebula Clouds along the spiral plane
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const dist = 24 + (i % 5) * 14;
      const nebSprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: nebulaTex,
          color: i % 2 === 0 ? 0x3b66b8 : 0x7c5295,
          transparent: true,
          opacity: 0.16,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        })
      );
      nebSprite.position.set(Math.cos(angle) * dist, (Math.random() - 0.5) * 4, Math.sin(angle) * dist);
      nebSprite.scale.set(28, 16, 1);
      starField.add(nebSprite);
    }

    // Photorealistic Cratered & Mineral-Rich Asteroids
    const asteroids = [];
    const rockTextures = createAsteroidRockTextures();
    const rockGeometries = [0, 1, 2].map((seed) => {
      const g = new THREE.IcosahedronGeometry(0.15, 2);
      const posAttr = g.attributes.position;
      for (let v = 0; v < posAttr.count; v++) {
        const vx = posAttr.getX(v);
        const vy = posAttr.getY(v);
        const vz = posAttr.getZ(v);
        const lump =
          0.82 +
          0.24 * Math.sin(vx * 18 + seed * 2.1) * Math.cos(vy * 16 - seed) +
          0.14 * Math.sin(vz * 22 + seed * 3.4);
        posAttr.setXYZ(v, vx * lump, vy * lump * 0.78, vz * lump * 0.92);
      }
      g.computeVertexNormals();
      return g;
    });

    const asteroidTints = [0x8c857b, 0x736e68, 0x9e9284, 0x676b73];
    for (let i = 0; i < 85; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: asteroidTints[i % asteroidTints.length],
        map: rockTextures.map,
        bumpMap: rockTextures.bumpMap,
        bumpScale: 0.045,
        roughness: 0.88,
        metalness: i % 4 === 0 ? 0.32 : 0.12
      });
      const mesh = new THREE.Mesh(rockGeometries[i % rockGeometries.length], mat);
      const scale = 0.55 + Math.random() * 1.45;
      mesh.scale.set(scale, scale * (0.68 + Math.random() * 0.25), scale * (0.8 + Math.random() * 0.25));
      scene.add(mesh);
      asteroids.push({
        mesh,
        radius: 10.6 + Math.random() * 3.8,
        angle: Math.random() * Math.PI * 2,
        speed: 0.001 + Math.random() * 0.0018,
        yOffset: (Math.random() - 0.5) * 1.7,
        rotSpeed: 0.006 + Math.random() * 0.014
      });
    }

    // Photorealistic Astronomical Comets (Glowing Nucleus + Ion Tail + Curved Dust Tail + Sparkle Coma)
    const comets = [];
    const ionTailTex = createCometTailTexture('rgba(165, 225, 255, 0.92)', 'rgba(56, 189, 248, 0.35)');
    const dustTailTex = createCometTailTexture('rgba(255, 244, 214, 0.72)', 'rgba(251, 191, 36, 0.2)');

    for (let i = 0; i < 5; i++) {
      const group = new THREE.Group();

      // Bright icy nucleus
      const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );

      // Multi-layered atmospheric coma glow
      const innerComa = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: starGlowTex,
          color: 0xe0f2fe,
          transparent: true,
          opacity: 0.95,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        })
      );
      innerComa.scale.set(0.95, 0.95, 1);

      const outerComa = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: starGlowTex,
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.45,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        })
      );
      outerComa.scale.set(2.1, 2.1, 1);

      // Narrow straight blue ionized plasma tail (crossed planes for 3D volume)
      const ionPlaneGeom = new THREE.PlaneGeometry(0.55, 5.4);
      ionPlaneGeom.rotateX(Math.PI / 2);
      ionPlaneGeom.translate(0, 0, -2.7);
      const ionMat = new THREE.MeshBasicMaterial({
        map: ionTailTex,
        transparent: true,
        opacity: 0.78,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const ionTail1 = new THREE.Mesh(ionPlaneGeom, ionMat);
      const ionTail2 = new THREE.Mesh(ionPlaneGeom, ionMat);
      ionTail2.rotation.z = Math.PI / 2;

      // Broader warm sunlit dust tail angled slightly off the ion tail
      const dustPlaneGeom = new THREE.PlaneGeometry(1.15, 4.6);
      dustPlaneGeom.rotateX(Math.PI / 2);
      dustPlaneGeom.translate(0, 0, -2.3);
      const dustMat = new THREE.MeshBasicMaterial({
        map: dustTailTex,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const dustTail = new THREE.Mesh(dustPlaneGeom, dustMat);
      dustTail.rotation.y = 0.14;
      dustTail.rotation.x = 0.06;

      // Trailing ice-crystal particle stream behind comet
      const trailParticleCount = 26;
      const pPositions = new Float32Array(trailParticleCount * 3);
      for (let p = 0; p < trailParticleCount; p++) {
        const dist = (p / trailParticleCount) * 4.8;
        const spread = 0.06 + (p / trailParticleCount) * 0.34;
        pPositions[p * 3] = (Math.random() - 0.5) * spread;
        pPositions[p * 3 + 1] = (Math.random() - 0.5) * spread;
        pPositions[p * 3 + 2] = -dist;
      }
      const pGeom = new THREE.BufferGeometry();
      pGeom.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
      const trailParticles = new THREE.Points(
        pGeom,
        new THREE.PointsMaterial({
          size: 0.16,
          map: starGlowTex,
          color: 0xbae6fd,
          transparent: true,
          opacity: 0.75,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        })
      );

      group.add(nucleus, innerComa, outerComa, ionTail1, ionTail2, dustTail, trailParticles);
      scene.add(group);
      comets.push({
        group,
        ionTail1,
        ionTail2,
        dustTail,
        outerComa,
        radius: 14.5 + i * 4.2,
        angle: (i * Math.PI * 2) / 5,
        speed: 0.0045 + i * 0.001,
        inclination: i * 1.15
      });
    }

    // Sleek Astronomical Spacecraft ("DHEERAJ" & "ALL STARS")
    const createShipBadge = (labelText, accentHex) => {
      const c = document.createElement('canvas');
      c.width = 400;
      c.height = 88;
      const ctx = c.getContext('2d');
      ctx.fillStyle = 'rgba(3, 5, 12, 0.85)';
      ctx.beginPath();
      ctx.roundRect(14, 14, 372, 60, 14);
      ctx.fill();
      ctx.strokeStyle = accentHex;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.fillStyle = '#f8fafc';
      ctx.font = '600 24px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labelText, 200, 45);
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true }));
      sprite.scale.set(2.2, 0.48, 1);
      sprite.position.set(0, 0.62, 0);
      return sprite;
    };

    const makeShip = (hullColor, wingColor, trailColor, badgeText, badgeHex, radius) => {
      const wrapper = new THREE.Group();
      const body = new THREE.Group();

      const fuselage = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.16, 1.15, 16),
        new THREE.MeshStandardMaterial({ color: hullColor, metalness: 0.85, roughness: 0.2 })
      );
      fuselage.rotation.x = Math.PI / 2;

      const wings = new THREE.Mesh(
        new THREE.BoxGeometry(1.05, 0.02, 0.28),
        new THREE.MeshStandardMaterial({ color: wingColor, metalness: 0.75, roughness: 0.3 })
      );

      const trailGeom = new THREE.ConeGeometry(0.09, 1.3, 12, 1, true);
      trailGeom.rotateX(-Math.PI / 2);
      trailGeom.translate(0, 0, -1.15);
      const trail = new THREE.Mesh(
        trailGeom,
        new THREE.MeshBasicMaterial({
          color: trailColor,
          transparent: true,
          opacity: 0.42,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        })
      );

      body.add(fuselage, wings, trail);
      wrapper.add(body, createShipBadge(badgeText, badgeHex));
      scene.add(wrapper);
      return { wrapper, body, trail, angle: 0, radius };
    };

    const dheerajShip = makeShip(0xe2e8f0, 0x38bdf8, 0x60a5fa, 'DHEERAJ EXPLORER', '#38bdf8', 8.2);
    const allStarsShip = makeShip(0xfef3c7, 0xf59e0b, 0xfbbf24, 'ALL STARS VOYAGER', '#fbbf24', 9.5);
    allStarsShip.angle = Math.PI;

    sceneRefs.current = {
      ...sceneRefs.current,
      scene,
      camera,
      renderer,
      globeGroup,
      coreMesh,
      atmosphereMesh,
      ringGroup,
      starField,
      comets,
      asteroids,
      dheerajShip,
      allStarsShip
    };

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onPointerDown = (e) => {
      sceneRefs.current.isDragging = true;
      sceneRefs.current.prevPointer = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      sceneRefs.current.isDragging = false;
    };

    const onPointerMove = (e) => {
      const state = sceneRefs.current;
      if (state.isDragging) {
        const dx = e.clientX - state.prevPointer.x;
        const dy = e.clientY - state.prevPointer.y;
        state.targetRotationY += dx * 0.0055;
        state.targetRotationX = Math.max(-1.1, Math.min(1.1, state.targetRotationX + dy * 0.0045));
        state.prevPointer = { x: e.clientX, y: e.clientY };
      }

      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      const visibleCards = state.cardMeshes.filter((m) => m.visible);
      const hits = raycaster.intersectObjects(visibleCards);

      if (hits.length > 0) {
        state.hoveredMesh = hits[0].object;
        container.style.cursor = 'pointer';
        const s = state.hoveredMesh.userData.star;
        setHoveredInfo({
          star: s,
          left: Math.min(window.innerWidth - 335, e.clientX + 16),
          top: Math.min(window.innerHeight - 280, Math.max(16, e.clientY - 20))
        });
      } else {
        state.hoveredMesh = null;
        container.style.cursor = state.isDragging ? 'grabbing' : 'grab';
        setHoveredInfo(null);
      }
    };

    const onClick = () => {
      const hm = sceneRefs.current.hoveredMesh;
      if (hm) {
        setSelectedStarIdx(hm.userData.starIndex);
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      const nextZ = Math.max(9.5, Math.min(28, camera.position.z + e.deltaY * 0.012));
      camera.position.z = nextZ;
      setZoomLevel(Number(nextZ.toFixed(1)));
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('click', onClick);
    container.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', onResize);

    let animFrameId;
    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const now = performance.now() * 0.001;
      const st = sceneRefs.current;

      if (st.starField) st.starField.rotation.y += 0.00018;

      if (st.dheerajShip) {
        st.dheerajShip.angle += 0.011;
        const t = st.dheerajShip.angle;
        const r = st.dheerajShip.radius + Math.sin(t * 2.0) * 0.75;
        const x = Math.cos(t) * r + Math.sin(t * 1.4) * 0.9;
        const y = Math.sin(t * 1.6) * 3.4 + Math.cos(t * 0.9) * 1.0;
        const z = Math.sin(t) * r + Math.cos(t * 1.3) * 0.9;

        const nextT = t + 0.035;
        const nextR = st.dheerajShip.radius + Math.sin(nextT * 2.0) * 0.75;
        st.dheerajShip.wrapper.position.set(x, y, z);
        st.dheerajShip.wrapper.lookAt(
          Math.cos(nextT) * nextR + Math.sin(nextT * 1.4) * 0.9,
          Math.sin(nextT * 1.6) * 3.4 + Math.cos(nextT * 0.9) * 1.0,
          Math.sin(nextT) * nextR + Math.cos(nextT * 1.3) * 0.9
        );
        st.dheerajShip.body.rotation.z += 0.025;
        st.dheerajShip.body.rotation.x = Math.sin(now * 1.4) * 0.25;
        st.dheerajShip.trail.scale.z = 0.88 + Math.sin(now * 14) * 0.16;
      }

      if (st.allStarsShip) {
        st.allStarsShip.angle -= 0.0055;
        const t = st.allStarsShip.angle;
        const r = st.allStarsShip.radius + Math.cos(t * 1.5) * 0.6;
        const x = Math.cos(t) * r;
        const y = Math.cos(t * 1.2) * 3.2;
        const z = Math.sin(t) * r;

        const nextT = t - 0.025;
        const nextR = st.allStarsShip.radius + Math.cos(nextT * 1.5) * 0.6;
        st.allStarsShip.wrapper.position.set(x, y, z);
        st.allStarsShip.wrapper.lookAt(
          Math.cos(nextT) * nextR,
          Math.cos(nextT * 1.2) * 3.2,
          Math.sin(nextT) * nextR
        );
        st.allStarsShip.body.rotation.z = Math.sin(now * 0.9) * 0.35;
        st.allStarsShip.trail.scale.z = 0.9 + Math.sin(now * 10) * 0.14;
      }

      st.comets.forEach((c, idx) => {
        c.angle += c.speed;
        const nextA = c.angle + 0.04;
        c.group.position.set(
          Math.cos(c.angle) * c.radius,
          Math.sin(c.angle * 1.4 + c.inclination) * 11,
          Math.sin(c.angle) * c.radius
        );
        c.group.lookAt(
          Math.cos(nextA) * c.radius,
          Math.sin(nextA * 1.4 + c.inclination) * 11,
          Math.sin(nextA) * c.radius
        );
        const shimmer = 0.92 + Math.sin(now * 5 + idx * 1.7) * 0.12;
        if (c.ionTail1) c.ionTail1.scale.z = shimmer;
        if (c.ionTail2) c.ionTail2.scale.z = shimmer;
        if (c.outerComa) {
          const comaScale = 2.0 + Math.sin(now * 4 + idx) * 0.25;
          c.outerComa.scale.set(comaScale, comaScale, 1);
        }
      });

      st.asteroids.forEach((a) => {
        a.angle += a.speed;
        a.mesh.position.set(
          Math.cos(a.angle) * a.radius,
          a.yOffset + Math.sin(a.angle * 2) * 0.35,
          Math.sin(a.angle) * a.radius
        );
        a.mesh.rotation.x += a.rotSpeed;
        a.mesh.rotation.y += a.rotSpeed * 1.3;
      });

      if (st.globeGroup) {
        if (isAutoRotatingRef.current && !st.isDragging) {
          st.targetRotationY += 0.0022;
        }
        st.globeGroup.rotation.y += (st.targetRotationY - st.globeGroup.rotation.y) * 0.08;
        st.globeGroup.rotation.x += (st.targetRotationX - st.globeGroup.rotation.x) * 0.08;
      }

      if (st.ringGroup) st.ringGroup.rotation.z += 0.0012;

      st.cardMeshes.forEach((mesh) => {
        const isHovered = st.hoveredMesh === mesh;
        const targetScale = isHovered ? 1.26 : 1.0;
        mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 0.16);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('click', onClick);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  // Build / rebuild 3D star cards whenever the hydrated stars list updates
  useEffect(() => {
    const globeGroup = sceneRefs.current.globeGroup;
    const renderer = sceneRefs.current.renderer;
    if (!globeGroup) return;

    const maxAnisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 8;

    sceneRefs.current.cardMeshes.forEach((m) => {
      globeGroup.remove(m);
      if (m.material?.map) m.material.map.dispose();
      if (m.material) m.material.dispose();
    });
    sceneRefs.current.cardMeshes = [];

    const cardGeom = new THREE.PlaneGeometry(0.47, 0.6);
    const R = 6.32;

    DECADE_COUNTRIES.forEach((country) => {
      const indexedInEra = stars
        .map((star, starIndex) => ({ star, starIndex }))
        .filter(({ star }) => star.era === country.id);

      const cols = 16;
      const rows = Math.ceil(indexedInEra.length / cols);

      indexedInEra.forEach(({ star, starIndex }, idx) => {
        const r = Math.floor(idx / cols);
        const c = idx % cols;
        const u = (c + 0.5) / cols - 0.5;
        const v = (r + 0.5) / rows - 0.5;

        const lon = country.lonCenter + u * (country.lonSpan * 0.9);
        const lat = country.latCenter - v * (country.latSpan * 0.86);
        const pos = latLonToVec3(lat, lon, R);

        const cachedImg = star.photoUrl ? imageCacheRef.current.get(star.photoUrl) : null;
        const mat = new THREE.MeshBasicMaterial({
          map: createStarCardTexture(star, cachedImg, maxAnisotropy, starIndex + 1),
          side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(cardGeom, mat);
        mesh.position.copy(pos);
        mesh.lookAt(pos.clone().multiplyScalar(2));
        mesh.userData = { star, starIndex };

        globeGroup.add(mesh);
        sceneRefs.current.cardMeshes.push(mesh);
      });
    });
  }, [stars]);

  // Apply industry, decade, and search filters to 3D cards
  const visibleCount = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let count = 0;

    sceneRefs.current.cardMeshes.forEach((mesh) => {
      const s = mesh.userData.star;
      const matchIndustry = activeIndustry === 'ALL' || s.industry === activeIndustry;
      const matchEra = activeEra === 'ALL' || s.era === activeEra;
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.epithet.toLowerCase().includes(q) ||
        s.movies.some((m) => m.toLowerCase().includes(q));

      const isVisible = matchIndustry && matchEra && matchQuery;
      mesh.visible = isVisible;
      if (isVisible) count++;
    });

    if (activeEra !== 'ALL') {
      const country = DECADE_COUNTRIES.find((c) => c.id === activeEra);
      if (country) {
        sceneRefs.current.targetRotationY = THREE.MathUtils.degToRad(-country.lonCenter - 90);
        sceneRefs.current.targetRotationX = THREE.MathUtils.degToRad(country.latCenter * 0.45);
      }
    }

    return count || stars.length;
  }, [activeIndustry, activeEra, searchQuery, stars]);

  // Fly camera to selected star when opening modal
  useEffect(() => {
    if (selectedStarIdx === null) return;
    const mesh = sceneRefs.current.cardMeshes.find((m) => m.userData.starIndex === selectedStarIdx);
    if (mesh) {
      const pos = mesh.position;
      sceneRefs.current.targetRotationY = -Math.atan2(pos.x, pos.z);
      sceneRefs.current.targetRotationX = Math.max(-1.0, Math.min(1.0, Math.asin(pos.y / pos.length()) * 0.7));
    }
  }, [selectedStarIdx]);

  const handleCyclePlanet = () => {
    const nextIdx = (planetIndex + 1) % PLANET_THEMES.length;
    setPlanetIndex(nextIdx);
    const theme = PLANET_THEMES[nextIdx];
    const { coreMesh, atmosphereMesh, ringGroup } = sceneRefs.current;
    if (coreMesh) {
      const textures = createPlanetTextures(theme);
      coreMesh.material.map = textures.map;
      coreMesh.material.bumpMap = textures.bumpMap;
      coreMesh.material.needsUpdate = true;
    }
    if (atmosphereMesh) atmosphereMesh.material.color.setHex(theme.glow);
    if (ringGroup?.children[0]) {
      ringGroup.children[0].material.opacity = theme.hasRings ? 0.52 : 0.18;
    }
  };

  const handleZoomChange = (nextVal) => {
    const clamped = Math.max(9.5, Math.min(28, Number(nextVal)));
    setZoomLevel(Number(clamped.toFixed(1)));
    if (sceneRefs.current.camera) {
      sceneRefs.current.camera.position.z = clamped;
    }
  };

  const handleRetryMissing = async () => {
    const rehydrated = await hydrateAllPortraits(stars);
    setStars(rehydrated);
  };

  const handleApplyCustomUrl = async () => {
    if (editingStarIdx === null || !customUrlInput.trim()) return;
    const trimmed = customUrlInput.trim();
    await preloadImageElement(trimmed);
    setStars((prev) =>
      prev.map((s, idx) => (idx === editingStarIdx ? { ...s, photoUrl: trimmed } : s))
    );
    setEditingStarIdx(null);
    setCustomUrlInput('');
  };

  const loadedPhotosCount = useMemo(() => stars.filter((s) => isValidPhotoUrl(s.photoUrl)).length, [stars]);
  const missingStarsList = useMemo(
    () => stars.map((star, idx) => ({ star, idx })).filter(({ star }) => !isValidPhotoUrl(star.photoUrl)),
    [stars]
  );

  const selectedStar = selectedStarIdx !== null ? stars[selectedStarIdx] : null;
  const currentPlanet = PLANET_THEMES[planetIndex];

  return (
    <div
      className="relative w-screen h-screen overflow-hidden text-slate-100 select-none"
      style={{ background: 'radial-gradient(circle at 50% 48%, #070b18 0%, #03050c 58%, #010205 100%)' }}
    >
      {/* Smooth Preloader & Portrait Hydration Curtain */}
      {!isSceneReady && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center transition-opacity duration-500"
          style={{ background: 'radial-gradient(circle at 50% 45%, #0b0718 0%, #030207 75%)' }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-700 to-rose-900 flex items-center justify-center shadow-2xl mb-5 animate-pulse border border-amber-400/30">
            <svg className="w-9 h-9 text-slate-950" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-widest bg-gradient-to-r from-amber-200 via-amber-400 to-rose-400 bg-clip-text text-transparent mb-2">
            CINEMA GALAXY
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-md">{bootStage}</p>
          <div className="w-72 sm:w-96 h-2.5 rounded-full bg-white/10 overflow-hidden border border-amber-500/30 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 transition-all duration-200"
              style={{ width: `${bootProgress}%` }}
            />
          </div>
          <p className="mt-3 text-xs font-semibold text-amber-400">{bootProgress}% Hydrated</p>
        </div>
      )}

      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="fixed inset-0 w-full h-full z-0 cursor-grab" />

      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-20 pointer-events-none p-4 sm:p-6 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
        <div className="pointer-events-auto flex flex-wrap items-center gap-3">
          <div className="rounded-2xl px-4 py-3 flex items-center gap-3.5 bg-[#070510]/85 backdrop-blur-xl border border-amber-500/25 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-rose-800 flex items-center justify-center shadow-lg shrink-0">
              <svg className="w-6 h-6 text-slate-950" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold tracking-wider bg-gradient-to-r from-amber-200 via-amber-400 to-rose-400 bg-clip-text text-transparent">
                CINEMA GALAXY
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Bollywood & Hollywood Globe • <span className="text-amber-400 font-semibold">{visibleCount.toLocaleString()}</span> Icons{' '}
                <span className="text-emerald-400/90 font-medium ml-1">
                  • {loadedPhotosCount}/{stars.length} Photos
                </span>
              </p>
            </div>
          </div>

          {/* Industry Switcher */}
          <div className="rounded-2xl p-1 flex items-center gap-1 bg-[#070510]/85 backdrop-blur-xl border border-amber-500/25 shadow-xl">
            {['ALL', 'Bollywood', 'Hollywood'].map((ind) => (
              <button
                key={ind}
                onClick={() => setActiveIndustry(ind)}
                className={`px-3 py-2 rounded-xl text-xs transition cursor-pointer ${
                  activeIndustry === ind
                    ? 'font-semibold bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow'
                    : 'font-medium text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                {ind === 'ALL' ? '🌍 All Cinema' : ind === 'Bollywood' ? '🇮🇳 Bollywood' : '🎬 Hollywood'}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Decade Country Switcher */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
          <div className="relative flex-1 sm:flex-initial sm:w-56">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search star or movie..."
              className="w-full rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-[#070510]/85 backdrop-blur-xl border border-amber-500/25 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/70"
            />
            <svg
              className="w-4 h-4 text-amber-500/80 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="rounded-xl p-1 flex items-center gap-1 overflow-x-auto max-w-full bg-[#070510]/85 backdrop-blur-xl border border-amber-500/25">
            {['ALL', '1950s–60s', '1970s', '1980s', '1990s', '2000s', '2010s–20s'].map((era) => (
              <button
                key={era}
                onClick={() => setActiveEra(era)}
                className={`px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer whitespace-nowrap ${
                  activeEra === era
                    ? 'font-semibold bg-amber-500 text-slate-950'
                    : 'font-medium text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                {era === 'ALL' ? 'All Decades' : era === '1950s–60s' ? '50s–60s' : era}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Rich Hover Dossier Card */}
      {hoveredInfo && (
        <div
          style={{ left: hoveredInfo.left, top: hoveredInfo.top }}
          className="fixed z-30 pointer-events-none rounded-2xl p-3.5 bg-[#06040d]/95 backdrop-blur-xl border border-amber-500/50 shadow-2xl w-80 sm:w-96"
        >
          <div className="flex items-start gap-3">
            {/* Star Portrait Thumbnail */}
            <div className="w-16 h-20 rounded-xl p-0.5 bg-gradient-to-tr from-amber-500 via-amber-600 to-rose-700 shadow-lg shrink-0">
              <img
                src={
                  isValidPhotoUrl(hoveredInfo.star.photoUrl)
                    ? hoveredInfo.star.photoUrl
                    : `https://placehold.co/160x200/0b091a/fbbf24?text=${encodeURIComponent(hoveredInfo.star.name.slice(0, 2).toUpperCase())}`
                }
                alt={hoveredInfo.star.name}
                className="w-full h-full object-cover object-top rounded-[10px] bg-slate-950"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-1.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      {hoveredInfo.star.industry}
                    </span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                      {hoveredInfo.star.era}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-100 truncate">{hoveredInfo.star.name}</p>
                  <p className="text-[11px] text-amber-400/95 truncate">{hoveredInfo.star.epithet}</p>
                </div>
                {hoveredInfo.star.died ? (
                  <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/35">
                    ✝ Passed
                  </span>
                ) : (
                  <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/35">
                    ● Alive
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Born</span>
              <span className="text-slate-200 font-medium">{hoveredInfo.star.born || 'Unknown'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider">
                {hoveredInfo.star.died ? 'Died' : 'Status'}
              </span>
              <span className={`font-semibold ${hoveredInfo.star.died ? 'text-rose-300' : 'text-emerald-300'}`}>
                {hoveredInfo.star.died || 'Alive'}
              </span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-white/10 space-y-1 text-[11px]">
            <p className="text-slate-300 leading-snug">
              <span className="text-amber-400 font-semibold">★ Best Performance:</span>{' '}
              {hoveredInfo.star.movies[0] || hoveredInfo.star.epithet}
            </p>
            <p className="text-slate-300 leading-snug">
              <span className="text-amber-400 font-semibold">🏆 Awards:</span> {hoveredInfo.star.awards}
            </p>
          </div>

          <div className="mt-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-500">
                Highlighted Movies ({hoveredInfo.star.movies.length})
              </span>
              <span className="text-[9px] text-amber-400/80">★ Top Classics</span>
            </div>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {hoveredInfo.star.movies.map((m, i) => (
                <span
                  key={m}
                  className={`px-1.5 py-0.5 rounded text-[10px] ${
                    i < 4 ? 'bg-amber-500/20 text-amber-200 border border-amber-500/35' : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {i < 4 ? '★ ' : ''}
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="fixed bottom-4 left-4 right-4 z-20 pointer-events-none flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="pointer-events-auto flex flex-wrap items-center gap-2.5">
          <div className="rounded-full px-4 py-2 text-xs text-slate-400 hidden lg:flex items-center gap-2 bg-[#070510]/85 backdrop-blur-xl border border-amber-500/25">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>Drag to orbit • Click a star portrait to inspect</span>
          </div>

          <div className="rounded-full px-3.5 py-1.5 flex items-center gap-2.5 bg-[#070510]/85 backdrop-blur-xl border border-amber-500/30">
            <button
              onClick={() => handleZoomChange(zoomLevel - 1.5)}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-amber-500/25 text-amber-400 font-bold text-sm flex items-center justify-center transition cursor-pointer"
              title="Zoom In"
            >
              +
            </button>
            <span className="text-[11px] font-semibold text-slate-400">Zoom</span>
            <input
              type="range"
              min="9.5"
              max="28"
              step="0.2"
              value={zoomLevel}
              onChange={(e) => handleZoomChange(e.target.value)}
              className="w-24 sm:w-28 accent-amber-500 cursor-pointer"
            />
            <button
              onClick={() => handleZoomChange(zoomLevel + 1.5)}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-amber-500/25 text-amber-400 font-bold text-sm flex items-center justify-center transition cursor-pointer"
              title="Zoom Out"
            >
              −
            </button>
          </div>
        </div>

        <div className="pointer-events-auto rounded-2xl p-1.5 flex items-center gap-1.5 bg-[#070510]/85 backdrop-blur-xl border border-amber-500/25">
          <button
            onClick={() => setIsAutoRotating((v) => !v)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition cursor-pointer"
          >
            Auto-Rotate: {isAutoRotating ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setSelectedStarIdx(Math.floor(Math.random() * stars.length))}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 via-orange-600 to-rose-700 hover:brightness-110 text-slate-950 shadow-md transition cursor-pointer"
          >
            ✦ Spotlight Random
          </button>

          <button
            onClick={handleCyclePlanet}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition cursor-pointer"
          >
            {currentPlanet.icon} {currentPlanet.name}
          </button>

          <button
            onClick={() => setIsDirectoryOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition cursor-pointer"
          >
            All Stars
          </button>
        </div>
      </div>

      {/* Star Profile Modal */}
      {selectedStar && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="rounded-3xl max-w-lg w-full overflow-hidden bg-[#070510]/95 border border-amber-500/40 shadow-2xl relative">
            <div className="h-32 w-full bg-gradient-to-r from-amber-900 via-rose-950 to-purple-950 relative">
              <button
                onClick={() => setSelectedStarIdx(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-slate-200 flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="px-6 pb-6 -mt-16 relative">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="w-28 h-32 rounded-2xl p-1 bg-gradient-to-tr from-amber-500 via-amber-700 to-rose-800 shadow-xl shrink-0">
                  <img
                    src={
                      isValidPhotoUrl(selectedStar.photoUrl)
                        ? selectedStar.photoUrl
                        : `https://placehold.co/240x300/0b091a/fbbf24?text=${encodeURIComponent(selectedStar.name)}`
                    }
                    alt={selectedStar.name}
                    className="w-full h-full object-cover object-top rounded-xl bg-slate-950"
                  />
                </div>
                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/35">
                      {selectedStar.industry}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {selectedStar.era}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-100 leading-tight">{selectedStar.name}</h2>
                  <p className="text-sm text-amber-400 font-medium">{selectedStar.epithet}</p>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-300 leading-relaxed">{selectedStar.bio}</p>

              <div className="mt-5">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Highlighted Movies ({selectedStar.movies.length})
                  </h3>
                  <span className="text-[11px] text-amber-400/85 font-medium">★ Signature Filmography</span>
                </div>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
                  {selectedStar.movies.map((m, i) => (
                    <span
                      key={m}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium ${
                        i < 4
                          ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                          : 'bg-white/10 text-slate-300 border border-white/10'
                      }`}
                    >
                      {i < 4 ? '★ ' : ''}
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedStarIdx((selectedStarIdx - 1 + stars.length) % stars.length)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition cursor-pointer"
                >
                  ← Previous Star
                </button>
                <button
                  onClick={() => setSelectedStarIdx((selectedStarIdx + 1) % stars.length)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer"
                >
                  Next Star →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Stars Directory & Missing Photos Auditor Modal */}
      {isDirectoryOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="rounded-3xl max-w-4xl w-full max-h-[82vh] flex flex-col overflow-hidden bg-[#070510]/95 border border-amber-500/35 shadow-2xl">
            <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-amber-400">Global Cinema Star Directory</h2>
                <p className="text-xs text-slate-400">
                  Loaded: {loadedPhotosCount} • Missing: {missingStarsList.length} of {stars.length} total stars
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setDirFilterMode('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    dirFilterMode === 'ALL' ? 'bg-amber-500 text-slate-950' : 'bg-white/10 text-slate-300'
                  }`}
                >
                  All Stars
                </button>
                <button
                  onClick={() => setDirFilterMode('MISSING')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    dirFilterMode === 'MISSING'
                      ? 'bg-rose-600 text-white'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  Missing Photos ({missingStarsList.length})
                </button>
                <button
                  onClick={handleRetryMissing}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition cursor-pointer"
                >
                  ↻ Retry Missing
                </button>
                <button
                  onClick={() => {
                    const txt = missingStarsList.map(({ star }) => `${star.name} (${star.industry})`).join('\n');
                    navigator.clipboard?.writeText(txt || 'All photos loaded!');
                    setCopiedNotice(true);
                    setTimeout(() => setCopiedNotice(false), 1800);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition cursor-pointer"
                >
                  {copiedNotice ? '✓ Copied!' : '📋 Copy List'}
                </button>
                <button
                  onClick={() => setIsDirectoryOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 flex items-center justify-center transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {editingStarIdx !== null && (
              <div className="px-5 py-3 bg-amber-500/10 border-b border-amber-500/30 flex flex-col sm:flex-row items-center gap-2">
                <span className="text-xs font-semibold text-amber-400 shrink-0">
                  Photo URL for {stars[editingStarIdx]?.name}:
                </span>
                <input
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="Paste direct image URL (https://...)"
                  className="flex-1 w-full rounded-xl bg-black/60 border border-amber-500/40 px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                />
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleApplyCustomUrl}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 transition cursor-pointer"
                  >
                    Apply to Globe
                  </button>
                  <button
                    onClick={() => setEditingStarIdx(null)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-white/10 text-slate-300 hover:bg-white/20 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(dirFilterMode === 'MISSING' ? missingStarsList : stars.map((star, idx) => ({ star, idx }))).map(
                ({ star, idx }) => {
                  const hasPhoto = isValidPhotoUrl(star.photoUrl);
                  return (
                    <div
                      key={`${star.name}-${idx}`}
                      className={`p-3 rounded-2xl flex items-center justify-between gap-2 transition ${
                        hasPhoto
                          ? 'bg-white/5 hover:bg-amber-500/15 border border-white/10'
                          : 'bg-rose-950/35 hover:bg-rose-900/45 border border-rose-500/40'
                      }`}
                    >
                      <button
                        onClick={() => {
                          setIsDirectoryOpen(false);
                          setSelectedStarIdx(idx);
                        }}
                        className="text-left flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                      >
                        <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0 overflow-hidden">
                          {hasPhoto ? (
                            <img src={star.photoUrl} alt={star.name} className="w-full h-full object-cover object-top" />
                          ) : (
                            star.name.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-100 truncate">{star.name}</p>
                          <p className={`text-[11px] truncate ${hasPhoto ? 'text-amber-400/90' : 'text-rose-300 font-semibold'}`}>
                            {hasPhoto ? `${star.industry} • ${star.era}` : `⚠ Missing • ${star.industry}`}
                          </p>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setEditingStarIdx(idx);
                          setCustomUrlInput(star.photoUrl || '');
                        }}
                        className="shrink-0 px-2 py-1 rounded-lg text-[10px] font-semibold bg-white/10 hover:bg-amber-500 hover:text-slate-950 text-slate-200 transition cursor-pointer"
                      >
                        {hasPhoto ? 'Edit' : '+ URL'}
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}