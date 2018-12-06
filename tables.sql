create table week_days (
	id serial not null primary key,
  day_number int not null,
  day_name text not null
);

create table waiters (
	id serial not null primary key,
	first_name text not null,
	last_name text not null
);

create table shifts (
	id serial not null primary key,
	waiter_id int not null,
	foreign key (waiter_id) references waiters(id),
	week_days_id int not null,
	foreign key (week_days_id) references week_days(id)
);

INSERT INTO week_days (day_number,day_name)
VALUES (1, 'Monday'),
(2, 'Tuesday'),
(3, 'Wednesday'),
(4, 'Thursday'),
(5, 'Friday'),
(6, 'Saturday'),
(7, 'Sunday');
