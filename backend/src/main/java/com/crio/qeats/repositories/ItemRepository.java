
package com.crio.qeats.repositories;

import com.crio.qeats.models.ItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<ItemEntity, String> {

}

