package com.example.partition.repository;

import com.example.partition.entity.UserFemale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserFemaleRepository extends JpaRepository<UserFemale, Integer> {
}
