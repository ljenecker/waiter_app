create table week_days (
	id serial not null primary key,
  day_number int not null,
  day_name text not null,
  day_name_short text not null
);

create table waiters (
	id serial not null primary key,
	username text not null
);

create table shifts (
	id serial not null primary key,
	waiter_id int not null,
	foreign key (waiter_id) references waiters(id),
	week_days_id int not null,
	foreign key (week_days_id) references week_days(id)
);

INSERT INTO week_days (day_number,day_name,day_name_short)
VALUES (1, 'Monday', 'Mon'),
(2, 'Tuesday', 'Tue'),
(3, 'Wednesday', 'Wed'),
(4, 'Thursday', 'Thu'),
(5, 'Friday', 'Fri'),
(6, 'Saturday', 'Sat'),
(7, 'Sunday', 'Sun');
