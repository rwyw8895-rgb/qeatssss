
package com.crio.qeats.models;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "items")
@NoArgsConstructor
public class ItemEntity {

  @Id
  private String id;

  @NotNull
  private String itemId;

  @NotNull
  private String name;

  @NotNull
  private String imageUrl;

  @NotNull
  private Double price;

  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "item_attributes", joinColumns = @JoinColumn(name = "item_id"))
  @Column(name = "attribute")
  @NotNull
  private List<String> attributes = new ArrayList<>();

}
