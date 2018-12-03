create table staff (
	id serial not null primary key,
	first_name text not null,
	last_name text not null
);

create table work_schedule (
	id serial not null primary key,
  monday BOOLEAN not null,
  tuesday BOOLEAN not null,
  wednesday BOOLEAN not null,
  thursday BOOLEAN not null,
  friday BOOLEAN not null,
  saturday BOOLEAN not null,
  sunday BOOLEAN not null,
	staff_id int not null,
	foreign key (staff_id) references staff(id)
);
